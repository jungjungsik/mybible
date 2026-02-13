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

// ── Search types ──

export type SearchScope = 'all' | 'old' | 'new';

interface ScoredMatch {
  verse: BibleVerse;
  score: number;
}

export interface SearchResponse {
  results: BibleVerse[];
  totalFound: number;
}

// Old Testament book IDs for scope filtering
const OT_BOOKS = new Set([
  'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA',
  '1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO',
  'ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO',
  'OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL',
]);

/**
 * Score a verse match for relevance ranking.
 * Higher score = more relevant.
 */
function scoreMatch(text: string, tokens: string[]): number {
  const lowerText = text.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    const idx = lowerText.indexOf(token);
    if (idx === -1) return -1; // All tokens must match

    // Base: found the token
    score += 10;

    // Bonus: match near the start of verse
    if (idx < 20) score += 5;

    // Bonus: word boundary match (space or start before token)
    if (idx === 0 || /\s/.test(lowerText[idx - 1])) score += 8;

    // Bonus: word boundary after token
    const endIdx = idx + token.length;
    if (endIdx === lowerText.length || /[\s,.\-;:!?]/.test(lowerText[endIdx])) score += 3;

    // Count multiple occurrences
    let count = 0;
    let searchFrom = 0;
    while (true) {
      const found = lowerText.indexOf(token, searchFrom);
      if (found === -1) break;
      count++;
      searchFrom = found + 1;
    }
    if (count > 1) score += count * 2;
  }

  // Bonus: shorter verses with matches are more focused/relevant
  if (text.length < 60) score += 4;
  else if (text.length < 120) score += 2;

  return score;
}

/**
 * Tokenize a search query into individual search terms.
 * Supports multi-word AND matching.
 */
function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

/**
 * Search through IndexedDB-persisted verses with relevance ranking.
 * Falls back to in-memory cache if IndexedDB is empty.
 * Supports multi-word AND matching, scope filtering, and pagination.
 */
export async function searchBible(
  versionId: string,
  query: string,
  scope: SearchScope = 'all',
  limit: number = 30
): Promise<SearchResponse> {
  if (!query || query.length < 2) return { results: [], totalFound: 0 };

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return { results: [], totalFound: 0 };

  const matches: ScoredMatch[] = [];

  function matchesScope(bookId: string): boolean {
    if (scope === 'all') return true;
    if (scope === 'old') return OT_BOOKS.has(bookId);
    return !OT_BOOKS.has(bookId); // 'new'
  }

  // Search persistent IndexedDB cache
  try {
    const allVerses = await db.verseCache
      .where('version')
      .equals(versionId)
      .toArray();

    if (allVerses.length > 0) {
      for (const v of allVerses) {
        if (!matchesScope(v.book)) continue;
        const score = scoreMatch(v.text, tokens);
        if (score > 0) {
          matches.push({
            verse: {
              book: v.book,
              chapter: v.chapter,
              verse: v.verse,
              text: v.text,
              version: v.version,
            },
            score,
          });
        }
      }

      // Sort by score descending, then by canonical order (book, chapter, verse)
      matches.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.verse.book !== b.verse.book) return a.verse.book.localeCompare(b.verse.book);
        if (a.verse.chapter !== b.verse.chapter) return a.verse.chapter - b.verse.chapter;
        return a.verse.verse - b.verse.verse;
      });

      return {
        results: matches.slice(0, limit).map((m) => m.verse),
        totalFound: matches.length,
      };
    }
  } catch {
    // Fall through to in-memory cache
  }

  // Fallback: in-memory cache
  const prefix = versionId + ':';

  cache.forEach((chapter, key) => {
    if (!key.startsWith(prefix)) return;

    for (let i = 0; i < chapter.verses.length; i++) {
      const verse = chapter.verses[i];
      if (!matchesScope(verse.book)) continue;
      const score = scoreMatch(verse.text, tokens);
      if (score > 0) {
        matches.push({ verse, score });
      }
    }
  });

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.verse.book !== b.verse.book) return a.verse.book.localeCompare(b.verse.book);
    if (a.verse.chapter !== b.verse.chapter) return a.verse.chapter - b.verse.chapter;
    return a.verse.verse - b.verse.verse;
  });

  return {
    results: matches.slice(0, limit).map((m) => m.verse),
    totalFound: matches.length,
  };
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
