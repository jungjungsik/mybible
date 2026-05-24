import { beforeEach, describe, expect, it } from 'vitest';
import {
  OT_BOOKS,
  clearCache,
  scoreMatch,
  searchBible,
  tokenizeQuery,
} from './bibleApi';
import { db } from '@/lib/db';
import type { CachedVerse } from '@/lib/db';

const seed = (rows: CachedVerse[]) => db.verseCache.bulkPut(rows);

beforeEach(async () => {
  clearCache();
  await db.verseCache.clear();
});

describe('tokenizeQuery', () => {
  it('lowercases and splits on whitespace', () => {
    expect(tokenizeQuery('God Loves us')).toEqual(['god', 'loves', 'us']);
  });

  it('drops tokens shorter than 2 characters', () => {
    expect(tokenizeQuery('a be c def')).toEqual(['be', 'def']);
  });

  it('returns empty array for blank query', () => {
    expect(tokenizeQuery('   ')).toEqual([]);
  });
});

describe('scoreMatch', () => {
  it('returns -1 when any token is missing', () => {
    expect(scoreMatch('hello world', ['hello', 'missing'])).toBe(-1);
  });

  it('returns positive score when all tokens match', () => {
    expect(scoreMatch('hello world', ['hello'])).toBeGreaterThan(0);
  });

  it('scores shorter verses higher than longer ones (same token)', () => {
    const short = scoreMatch('God loves you.', ['god']);
    const long = scoreMatch(
      'God loves you and has prepared a wonderful plan for your life that extends across many generations and includes great blessing.',
      ['god']
    );
    expect(short).toBeGreaterThan(long);
  });

  it('rewards multiple occurrences of a token', () => {
    const once = scoreMatch('love is patient', ['love']);
    const thrice = scoreMatch('love love love', ['love']);
    expect(thrice).toBeGreaterThan(once);
  });

  it('rewards word-boundary matches over substring-only matches', () => {
    // 'love' at word boundary vs 'love' as part of 'beloved'
    const boundary = scoreMatch('love wins', ['love']);
    const inside = scoreMatch('the beloved', ['love']);
    expect(boundary).toBeGreaterThan(inside);
  });
});

describe('OT_BOOKS', () => {
  it('includes all 39 Old Testament books', () => {
    expect(OT_BOOKS.size).toBe(39);
  });

  it('does not include New Testament books', () => {
    expect(OT_BOOKS.has('MAT')).toBe(false);
    expect(OT_BOOKS.has('JHN')).toBe(false);
    expect(OT_BOOKS.has('REV')).toBe(false);
  });

  it('contains canonical OT entries', () => {
    expect(OT_BOOKS.has('GEN')).toBe(true);
    expect(OT_BOOKS.has('PSA')).toBe(true);
    expect(OT_BOOKS.has('MAL')).toBe(true);
  });
});

describe('searchBible', () => {
  const makeVerse = (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    version = 'kjv'
  ): CachedVerse => ({
    id: `${version}:${book}:${chapter}:${verse}`,
    version,
    book,
    chapter,
    verse,
    text,
  });

  it('returns empty result for query shorter than 2 chars', async () => {
    const res = await searchBible('kjv', 'a');
    expect(res.results).toEqual([]);
    expect(res.totalFound).toBe(0);
  });

  it('returns empty result for empty query', async () => {
    const res = await searchBible('kjv', '');
    expect(res.results).toEqual([]);
    expect(res.totalFound).toBe(0);
  });

  it('finds verses matching the query in IndexedDB', async () => {
    await seed([
      makeVerse('JHN', 3, 16, 'For God so loved the world'),
      makeVerse('JHN', 3, 17, 'For God sent not his Son into the world'),
      makeVerse('GEN', 1, 1, 'In the beginning God created the heaven'),
    ]);

    const res = await searchBible('kjv', 'God');
    expect(res.totalFound).toBe(3);
    expect(res.results).toHaveLength(3);
  });

  it('filters by OT scope', async () => {
    await seed([
      makeVerse('GEN', 1, 1, 'God created the heaven and the earth'),
      makeVerse('JHN', 3, 16, 'For God so loved the world'),
    ]);

    const res = await searchBible('kjv', 'God', 'old');
    expect(res.totalFound).toBe(1);
    expect(res.results[0].verse.book).toBe('GEN');
  });

  it('filters by NT scope', async () => {
    await seed([
      makeVerse('GEN', 1, 1, 'God created the heaven and the earth'),
      makeVerse('JHN', 3, 16, 'For God so loved the world'),
    ]);

    const res = await searchBible('kjv', 'God', 'new');
    expect(res.totalFound).toBe(1);
    expect(res.results[0].verse.book).toBe('JHN');
  });

  it('respects limit but reports totalFound for full match set', async () => {
    const verses = Array.from({ length: 50 }, (_, i) =>
      makeVerse('GEN', 1, i + 1, `God spoke verse ${i + 1}`)
    );
    await seed(verses);

    const res = await searchBible('kjv', 'God', 'all', 10);
    expect(res.results).toHaveLength(10);
    expect(res.totalFound).toBe(50);
  });

  it('only returns verses for the requested version', async () => {
    await seed([
      makeVerse('JHN', 3, 16, 'For God so loved', 'kjv'),
      makeVerse('JHN', 3, 16, 'God so loved indeed', 'bsb'),
    ]);

    const res = await searchBible('kjv', 'God');
    expect(res.results.every((r) => r.verse.version === 'kjv')).toBe(true);
    expect(res.totalFound).toBe(1);
  });

  it('requires all tokens to match (AND semantics)', async () => {
    await seed([
      makeVerse('JHN', 3, 16, 'God loved the world'),
      makeVerse('JHN', 3, 17, 'God sent his Son'),
    ]);

    const res = await searchBible('kjv', 'God world');
    expect(res.totalFound).toBe(1);
    expect(res.results[0].verse.verse).toBe(16);
  });

  it('attaches ±1 verse context when available', async () => {
    await seed([
      makeVerse('JHN', 3, 15, 'previous verse text'),
      makeVerse('JHN', 3, 16, 'For God so loved the world'),
      makeVerse('JHN', 3, 17, 'next verse text'),
    ]);

    const res = await searchBible('kjv', 'loved');
    expect(res.results).toHaveLength(1);
    expect(res.results[0].verse.verse).toBe(16);
    expect(res.results[0].contextBefore?.verse).toBe(15);
    expect(res.results[0].contextBefore?.text).toBe('previous verse text');
    expect(res.results[0].contextAfter?.verse).toBe(17);
    expect(res.results[0].contextAfter?.text).toBe('next verse text');
  });

  it('leaves context undefined when neighboring verse is missing', async () => {
    await seed([
      // verse 16 is at chapter start with no neighbors cached
      makeVerse('JHN', 3, 16, 'For God so loved the world'),
    ]);

    const res = await searchBible('kjv', 'loved');
    expect(res.results[0].contextBefore).toBeUndefined();
    expect(res.results[0].contextAfter).toBeUndefined();
  });

  it('omits context when withContext is false', async () => {
    await seed([
      makeVerse('JHN', 3, 15, 'previous verse'),
      makeVerse('JHN', 3, 16, 'For God so loved the world'),
      makeVerse('JHN', 3, 17, 'next verse'),
    ]);

    const res = await searchBible('kjv', 'loved', 'all', 30, { withContext: false });
    expect(res.results[0].contextBefore).toBeUndefined();
    expect(res.results[0].contextAfter).toBeUndefined();
  });

  it('does not request verse 0 for context (verse 1 has no "before")', async () => {
    await seed([
      makeVerse('GEN', 1, 1, 'God created the heaven'),
      makeVerse('GEN', 1, 2, 'And the earth was without form'),
    ]);

    const res = await searchBible('kjv', 'God');
    expect(res.results[0].verse.verse).toBe(1);
    expect(res.results[0].contextBefore).toBeUndefined();
    expect(res.results[0].contextAfter?.verse).toBe(2);
  });
});
