/**
 * Curated cross-reference dataset for well-known passages.
 *
 * Scope: a hand-picked set of ~30 popular verses with 3-5 thematically
 * related references each. This is intentionally small — full coverage
 * (e.g. Treasury of Scripture Knowledge has 340k+ refs) requires a
 * separate, lazy-loaded data source. This MVP provides immediate value
 * for the verses readers most often look up.
 */

export interface VerseRef {
  book: string;
  chapter: number;
  verse: number;
}

function ref(book: string, chapter: number, verse: number): VerseRef {
  return { book, chapter, verse };
}

/** Key format: 'BOOK:CHAPTER:VERSE' */
const CROSS_REFS: Record<string, VerseRef[]> = {
  // ── Gospel of John ──
  'JHN:1:1': [
    ref('GEN', 1, 1),
    ref('1JN', 1, 1),
    ref('COL', 1, 16),
    ref('HEB', 1, 2),
  ],
  'JHN:3:16': [
    ref('ROM', 5, 8),
    ref('1JN', 4, 9),
    ref('1JN', 4, 10),
    ref('JHN', 15, 13),
    ref('EPH', 2, 4),
  ],
  'JHN:14:6': [
    ref('JHN', 10, 9),
    ref('ACT', 4, 12),
    ref('1TI', 2, 5),
    ref('HEB', 10, 20),
  ],
  'JHN:8:32': [
    ref('JHN', 14, 6),
    ref('ROM', 6, 18),
    ref('GAL', 5, 1),
  ],

  // ── Romans ──
  'ROM:8:28': [
    ref('GEN', 50, 20),
    ref('EPH', 1, 11),
    ref('JER', 29, 11),
    ref('ROM', 8, 29),
  ],
  'ROM:5:8': [
    ref('JHN', 3, 16),
    ref('1JN', 4, 10),
    ref('1PE', 3, 18),
  ],
  'ROM:10:9': [
    ref('MAT', 10, 32),
    ref('ACT', 16, 31),
    ref('1CO', 12, 3),
    ref('PHP', 2, 11),
  ],

  // ── Philippians ──
  'PHP:4:13': [
    ref('2CO', 12, 9),
    ref('EPH', 3, 16),
    ref('COL', 1, 11),
    ref('ISA', 40, 29),
  ],
  'PHP:4:6': [
    ref('1PE', 5, 7),
    ref('MAT', 6, 25),
    ref('PSA', 55, 22),
    ref('PHP', 4, 7),
  ],
  'PHP:4:7': [
    ref('JHN', 14, 27),
    ref('COL', 3, 15),
    ref('ISA', 26, 3),
  ],

  // ── 1 Corinthians ──
  '1CO:13:4': [
    ref('1CO', 13, 5),
    ref('1CO', 13, 7),
    ref('PRO', 10, 12),
    ref('1PE', 4, 8),
  ],

  // ── Ephesians ──
  'EPH:2:8': [
    ref('EPH', 2, 9),
    ref('ROM', 3, 24),
    ref('TIT', 3, 5),
    ref('2TI', 1, 9),
  ],

  // ── Hebrews ──
  'HEB:11:1': [
    ref('ROM', 8, 24),
    ref('2CO', 5, 7),
    ref('HEB', 11, 6),
  ],
  'HEB:4:12': [
    ref('2TI', 3, 16),
    ref('1PE', 1, 23),
    ref('ISA', 55, 11),
    ref('EPH', 6, 17),
  ],

  // ── Psalms ──
  'PSA:1:1': [
    ref('PSA', 1, 2),
    ref('PRO', 4, 14),
    ref('JER', 17, 7),
  ],
  'PSA:23:1': [
    ref('JHN', 10, 11),
    ref('ISA', 40, 11),
    ref('1PE', 2, 25),
    ref('EZK', 34, 23),
  ],
  'PSA:119:105': [
    ref('PRO', 6, 23),
    ref('2PE', 1, 19),
    ref('PSA', 19, 8),
  ],

  // ── Isaiah ──
  'ISA:40:31': [
    ref('ISA', 41, 10),
    ref('PSA', 27, 14),
    ref('2CO', 4, 16),
  ],
  'ISA:53:5': [
    ref('1PE', 2, 24),
    ref('ROM', 4, 25),
    ref('MAT', 8, 17),
  ],

  // ── Jeremiah ──
  'JER:29:11': [
    ref('ROM', 8, 28),
    ref('PRO', 23, 18),
    ref('PSA', 40, 5),
  ],

  // ── Proverbs ──
  'PRO:3:5': [
    ref('PRO', 3, 6),
    ref('PSA', 37, 5),
    ref('JER', 17, 7),
    ref('ISA', 26, 4),
  ],

  // ── Genesis ──
  'GEN:1:1': [
    ref('JHN', 1, 1),
    ref('COL', 1, 16),
    ref('HEB', 1, 2),
    ref('REV', 4, 11),
  ],

  // ── Matthew ──
  'MAT:6:33': [
    ref('LUK', 12, 31),
    ref('PSA', 37, 4),
    ref('1KI', 3, 11),
  ],
  'MAT:11:28': [
    ref('JHN', 7, 37),
    ref('ISA', 55, 1),
    ref('REV', 22, 17),
  ],
  'MAT:22:37': [
    ref('DEU', 6, 5),
    ref('MAT', 22, 39),
    ref('LUK', 10, 27),
  ],
  'MAT:28:19': [
    ref('MAT', 28, 20),
    ref('MRK', 16, 15),
    ref('ACT', 1, 8),
  ],

  // ── James ──
  'JAS:1:5': [
    ref('PRO', 2, 6),
    ref('1KI', 3, 9),
    ref('JHN', 14, 26),
  ],

  // ── 1 Peter ──
  '1PE:5:7': [
    ref('PHP', 4, 6),
    ref('PSA', 55, 22),
    ref('MAT', 6, 25),
  ],

  // ── 1 John ──
  '1JN:1:9': [
    ref('PSA', 32, 5),
    ref('PRO', 28, 13),
    ref('JAS', 5, 16),
  ],

  // ── Revelation ──
  'REV:3:20': [
    ref('JHN', 14, 23),
    ref('LUK', 12, 36),
    ref('SNG', 5, 2),
  ],
};

/**
 * Look up cross-references for a specific verse.
 * Returns an empty array if no curated references exist for this verse.
 */
export function getCrossReferences(
  book: string,
  chapter: number,
  verse: number
): VerseRef[] {
  return CROSS_REFS[`${book}:${chapter}:${verse}`] ?? [];
}

/** True if this verse has any curated cross-references. */
export function hasCrossReferences(
  book: string,
  chapter: number,
  verse: number
): boolean {
  return `${book}:${chapter}:${verse}` in CROSS_REFS;
}
