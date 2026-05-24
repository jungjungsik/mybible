import { describe, expect, it } from 'vitest';
import { getAdjacentChapter, parseReference } from './books';

describe('getAdjacentChapter', () => {
  it('returns the next chapter within the same book', () => {
    expect(getAdjacentChapter('GEN', 1, 'next')).toEqual({
      bookId: 'GEN',
      chapter: 2,
    });
  });

  it('returns the previous chapter within the same book', () => {
    expect(getAdjacentChapter('GEN', 5, 'prev')).toEqual({
      bookId: 'GEN',
      chapter: 4,
    });
  });

  it('crosses to the next book at the last chapter', () => {
    // Genesis has 50 chapters → next is Exodus 1
    expect(getAdjacentChapter('GEN', 50, 'next')).toEqual({
      bookId: 'EXO',
      chapter: 1,
    });
  });

  it('crosses to the previous book at chapter 1', () => {
    // Exodus 1 → Genesis 50
    expect(getAdjacentChapter('EXO', 1, 'prev')).toEqual({
      bookId: 'GEN',
      chapter: 50,
    });
  });

  it('returns null going prev from Genesis 1', () => {
    expect(getAdjacentChapter('GEN', 1, 'prev')).toBeNull();
  });

  it('returns null going next from Revelation 22', () => {
    expect(getAdjacentChapter('REV', 22, 'next')).toBeNull();
  });

  it('returns null for unknown book id', () => {
    expect(getAdjacentChapter('XXX', 1, 'next')).toBeNull();
  });

  it('crosses OT→NT boundary correctly (Malachi 4 → Matthew 1)', () => {
    expect(getAdjacentChapter('MAL', 4, 'next')).toEqual({
      bookId: 'MAT',
      chapter: 1,
    });
  });

  it('crosses NT→OT boundary correctly (Matthew 1 → Malachi 4)', () => {
    expect(getAdjacentChapter('MAT', 1, 'prev')).toEqual({
      bookId: 'MAL',
      chapter: 4,
    });
  });
});

describe('parseReference (smoke)', () => {
  it('returns null for non-reference strings', () => {
    expect(parseReference('하나님')).toBeNull();
  });
});
