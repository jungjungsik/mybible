import { BIBLE_BOOKS } from '@/lib/constants/books';
import { fetchChapter } from '@/lib/api/bibleApi';
import { db } from '@/lib/db/index';

export interface PrefetchProgress {
  current: number;
  total: number;
  currentBook: string;
  status: 'idle' | 'downloading' | 'done' | 'error' | 'cancelled';
  error?: string;
}

/** Total chapters across all 66 books */
export const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0);

/**
 * Check how many chapters are already cached for a given version.
 */
export async function getCachedChapterCount(versionId: string): Promise<number> {
  // Count unique book+chapter combos in verseCache for this version
  const verses = await db.verseCache
    .where('version')
    .equals(versionId)
    .toArray();

  const chapters = new Set<string>();
  for (const v of verses) {
    chapters.add(`${v.book}:${v.chapter}`);
  }
  return chapters.size;
}

/**
 * Build a list of all chapters, returning only those NOT yet cached.
 */
async function getUncachedChapters(
  versionId: string
): Promise<Array<{ bookId: string; bookName: string; chapter: number }>> {
  // Get already-cached chapters
  const verses = await db.verseCache
    .where('version')
    .equals(versionId)
    .toArray();

  const cached = new Set<string>();
  for (const v of verses) {
    cached.add(`${v.book}:${v.chapter}`);
  }

  const uncached: Array<{ bookId: string; bookName: string; chapter: number }> = [];
  for (const book of BIBLE_BOOKS) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      if (!cached.has(`${book.id}:${ch}`)) {
        uncached.push({ bookId: book.id, bookName: book.name, chapter: ch });
      }
    }
  }
  return uncached;
}

/**
 * Prefetch all Bible chapters for a version into IndexedDB.
 * - Skips already-cached chapters (resumable)
 * - Controlled concurrency (3 parallel requests)
 * - Calls onProgress for UI updates
 * - Returns an abort function
 */
export function prefetchAllChapters(
  versionId: string,
  onProgress: (progress: PrefetchProgress) => void
): { abort: () => void } {
  let aborted = false;
  const abortController = new AbortController();

  const run = async () => {
    try {
      const uncached = await getUncachedChapters(versionId);
      const total = TOTAL_CHAPTERS;
      const alreadyCached = total - uncached.length;

      if (uncached.length === 0) {
        onProgress({ current: total, total, currentBook: '', status: 'done' });
        return;
      }

      let completed = alreadyCached;
      const CONCURRENCY = 3;
      let index = 0;

      const fetchNext = async (): Promise<void> => {
        while (index < uncached.length && !aborted) {
          const i = index++;
          const item = uncached[i];

          onProgress({
            current: completed,
            total,
            currentBook: item.bookName,
            status: 'downloading',
          });

          try {
            await fetchChapter(versionId, item.bookId, item.chapter, abortController.signal);
          } catch (err) {
            // If aborted, stop silently
            if (aborted) return;
            // On individual chapter failure, continue to next
            console.warn(`Failed to fetch ${item.bookId} ${item.chapter}:`, err);
          }

          completed++;
        }
      };

      // Start N concurrent workers
      const workers = [];
      for (let w = 0; w < CONCURRENCY; w++) {
        workers.push(fetchNext());
      }
      await Promise.all(workers);

      if (aborted) {
        onProgress({ current: completed, total, currentBook: '', status: 'cancelled' });
      } else {
        onProgress({ current: total, total, currentBook: '', status: 'done' });
      }
    } catch (err) {
      if (!aborted) {
        onProgress({
          current: 0,
          total: TOTAL_CHAPTERS,
          currentBook: '',
          status: 'error',
          error: err instanceof Error ? err.message : 'Download failed',
        });
      }
    }
  };

  run();

  return {
    abort: () => {
      aborted = true;
      abortController.abort();
    },
  };
}
