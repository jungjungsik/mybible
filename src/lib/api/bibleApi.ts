/**
 * Bible API abstraction layer.
 *
 * - Routes requests to the correct provider based on version config
 * - Provides in-memory LRU cache (100 chapters)
 * - Retries once on failure, then falls back to alternate provider
 * - Exposes search across cached chapters
 */

import { BibleChapter, BibleVerse, SourceApi } from '@/types/bible';
import { getVersionById } from '@/lib/constants/versions';
import { fetchWldehChapter } from '@/lib/api/providers/wldeh';
import { fetchHelloaoChapter } from '@/lib/api/providers/helloao';
import { db } from '@/lib/db/index';

// ── In-memory LRU cache ──

const cache = new Map<string, BibleChapter>();
const MAX_CACHE_SIZE = 100;

function getCacheKey(
  versionId: string,
  bookId: string,
  chapter: number
): string {
  return `${versionId}:${bookId}:${chapter}`;
}

function addToCache(key: string, data: BibleChapter): void {
  // Simple LRU: delete-then-set moves key to end of Map iteration order
  if (cache.has(key)) {
    cache.delete(key);
  } else if (cache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry (first key in iteration order)
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, data);
}

// ── Provider dispatch ──

async function fetchFromProvider(
  sourceApi: SourceApi,
  versionId: string,
  bookId: string,
  chapter: number,
  signal?: AbortSignal
): Promise<BibleChapter> {
  switch (sourceApi) {
    case 'wldeh':
      return fetchWldehChapter(versionId, bookId, chapter, signal);
    case 'helloao':
      return fetchHelloaoChapter(versionId, bookId, chapter, signal);
    default:
      throw new Error(`Unknown source API: ${sourceApi}`);
  }
}

function getAlternateApi(api: SourceApi): SourceApi {
  return api === 'wldeh' ? 'helloao' : 'wldeh';
}

// ── Public API ──

/**
 * Fetch a single chapter. Uses cache, retries once, then falls back
 * to the alternate provider.
 */
export async function fetchChapter(
  versionId: string,
  bookId: string,
  chapter: number,
  signal?: AbortSignal
): Promise<BibleChapter> {
  const key = getCacheKey(versionId, bookId, chapter);

  // Check cache first
  const cached = cache.get(key);
  if (cached) {
    // Touch for LRU: move to end
    cache.delete(key);
    cache.set(key, cached);
    return cached;
  }

  const version = getVersionById(versionId);
  if (!version) {
    throw new Error(`Unknown Bible version: ${versionId}`);
  }

  // Attempt 1: primary provider
  try {
    const data = await fetchFromProvider(
      version.sourceApi,
      versionId,
      bookId,
      chapter,
      signal
    );
    addToCache(key, data);
    persistVerses(data);
    return data;
  } catch (primaryError) {
    // If aborted, don't retry
    if (signal?.aborted) throw primaryError;

    // Attempt 2: retry primary once
    try {
      const data = await fetchFromProvider(
        version.sourceApi,
        versionId,
        bookId,
        chapter,
        signal
      );
      addToCache(key, data);
      return data;
    } catch {
      // If aborted, don't fallback
      if (signal?.aborted) throw primaryError;

      // Attempt 3: fallback to alternate provider
      try {
        const fallbackApi = getAlternateApi(version.sourceApi);
        const data = await fetchFromProvider(
          fallbackApi,
          versionId,
          bookId,
          chapter,
          signal
        );
        addToCache(key, data);
        return data;
      } catch {
        // All attempts failed — throw the original error for clarity
        throw primaryError;
      }
    }
  }
}

/**
 * Persist fetched chapter verses to IndexedDB for search.
 */
async function persistVerses(chapter: BibleChapter): Promise<void> {
  try {
    const entries = chapter.verses.map(v => ({
      id: `${v.version}:${v.book}:${v.chapter}:${v.verse}`,
      version: v.version,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
    }));
    await db.verseCache.bulkPut(entries);
  } catch {
    // Silently fail — search still works with in-memory cache
  }
}

/**
 * Search through IndexedDB-persisted verses matching the query.
 * Falls back to in-memory cache if IndexedDB is empty.
 * Returns up to 50 results.
 */
export async function searchBible(
  versionId: string,
  query: string
): Promise<BibleVerse[]> {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();

  // Search persistent IndexedDB cache
  try {
    const allVerses = await db.verseCache
      .where('version')
      .equals(versionId)
      .toArray();

    if (allVerses.length > 0) {
      const results: BibleVerse[] = [];
      for (const v of allVerses) {
        if (v.text.toLowerCase().includes(lowerQuery)) {
          results.push({
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text,
            version: v.version,
          });
          if (results.length >= 50) break;
        }
      }
      return results;
    }
  } catch {
    // Fall through to in-memory cache
  }

  // Fallback: in-memory cache
  const results: BibleVerse[] = [];
  const prefix = versionId + ':';

  cache.forEach((chapter, key) => {
    if (results.length >= 50) return;
    if (!key.startsWith(prefix)) return;

    for (let i = 0; i < chapter.verses.length; i++) {
      const verse = chapter.verses[i];
      if (verse.text.toLowerCase().includes(lowerQuery)) {
        results.push(verse);
        if (results.length >= 50) return;
      }
    }
  });

  return results;
}

/**
 * Get the current cache (read-only access for external consumers).
 */
export function getCachedChapters(): ReadonlyMap<string, BibleChapter> {
  return cache;
}

/**
 * Clear the entire cache. Useful for testing or version switching.
 */
export function clearCache(): void {
  cache.clear();
}
