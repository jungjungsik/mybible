import { describe, expect, it } from 'vitest';
import { getCrossReferences, hasCrossReferences } from './crossRefs';

describe('crossRefs', () => {
  it('returns curated references for John 3:16', () => {
    const refs = getCrossReferences('JHN', 3, 16);
    expect(refs.length).toBeGreaterThan(0);
    expect(refs).toContainEqual({ book: 'ROM', chapter: 5, verse: 8 });
  });

  it('returns empty array for unmapped verses', () => {
    expect(getCrossReferences('GEN', 50, 25)).toEqual([]);
  });

  it('hasCrossReferences agrees with getCrossReferences', () => {
    expect(hasCrossReferences('JHN', 3, 16)).toBe(true);
    expect(hasCrossReferences('GEN', 50, 25)).toBe(false);
  });

  it('all curated entries point to valid Bible book ids', async () => {
    const { BIBLE_BOOKS } = await import('@/lib/constants/books');
    const validIds = new Set(BIBLE_BOOKS.map((b) => b.id));

    // Sample a handful of curated entries
    const samples: Array<[string, number, number]> = [
      ['JHN', 3, 16],
      ['ROM', 8, 28],
      ['PSA', 23, 1],
      ['GEN', 1, 1],
      ['REV', 3, 20],
    ];

    for (const [book, ch, v] of samples) {
      const refs = getCrossReferences(book, ch, v);
      for (const r of refs) {
        expect(validIds.has(r.book)).toBe(true);
        expect(r.chapter).toBeGreaterThan(0);
        expect(r.verse).toBeGreaterThan(0);
      }
    }
  });
});
