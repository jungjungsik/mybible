/**
 * Book ID mapping between our internal 3-letter IDs and each API's format.
 *
 * Internal IDs: GEN, EXO, LEV, ... (3-letter uppercase, matching helloao)
 * wldeh API:    lowercase full English names (genesis, exodus, leviticus, ...)
 * helloao API:  same 3-letter uppercase IDs as ours (GEN, EXO, LEV, ...)
 */

// ── wldeh/bible-api uses lowercase full English book names ──

const INTERNAL_TO_WLDEH: Record<string, string> = {
  // Old Testament
  GEN: 'genesis',
  EXO: 'exodus',
  LEV: 'leviticus',
  NUM: 'numbers',
  DEU: 'deuteronomy',
  JOS: 'joshua',
  JDG: 'judges',
  RUT: 'ruth',
  '1SA': '1samuel',
  '2SA': '2samuel',
  '1KI': '1kings',
  '2KI': '2kings',
  '1CH': '1chronicles',
  '2CH': '2chronicles',
  EZR: 'ezra',
  NEH: 'nehemiah',
  EST: 'esther',
  JOB: 'job',
  PSA: 'psalms',
  PRO: 'proverbs',
  ECC: 'ecclesiastes',
  SNG: 'songofsolomon',
  ISA: 'isaiah',
  JER: 'jeremiah',
  LAM: 'lamentations',
  EZK: 'ezekiel',
  DAN: 'daniel',
  HOS: 'hosea',
  JOL: 'joel',
  AMO: 'amos',
  OBA: 'obadiah',
  JON: 'jonah',
  MIC: 'micah',
  NAM: 'nahum',
  HAB: 'habakkuk',
  ZEP: 'zephaniah',
  HAG: 'haggai',
  ZEC: 'zechariah',
  MAL: 'malachi',

  // New Testament
  MAT: 'matthew',
  MRK: 'mark',
  LUK: 'luke',
  JHN: 'john',
  ACT: 'acts',
  ROM: 'romans',
  '1CO': '1corinthians',
  '2CO': '2corinthians',
  GAL: 'galatians',
  EPH: 'ephesians',
  PHP: 'philippians',
  COL: 'colossians',
  '1TH': '1thessalonians',
  '2TH': '2thessalonians',
  '1TI': '1timothy',
  '2TI': '2timothy',
  TIT: 'titus',
  PHM: 'philemon',
  HEB: 'hebrews',
  JAS: 'james',
  '1PE': '1peter',
  '2PE': '2peter',
  '1JN': '1john',
  '2JN': '2john',
  '3JN': '3john',
  JUD: 'jude',
  REV: 'revelation',
};

/**
 * Convert our internal book ID to the wldeh API book path name.
 * wldeh uses lowercase full English names with no spaces.
 */
export function toWldehBookName(bookId: string): string {
  const name = INTERNAL_TO_WLDEH[bookId];
  if (!name) {
    throw new Error(`Unknown book ID for wldeh mapping: ${bookId}`);
  }
  return name;
}

/**
 * Convert our internal book ID to the helloao API book ID.
 * helloao uses the same 3-letter uppercase IDs as our internal system.
 */
export function toHelloaoBookId(bookId: string): string {
  // helloao uses the same IDs we do — pass through directly
  return bookId;
}

/**
 * Map our internal version ID to the wldeh directory name.
 * wldeh format: "en-kjv", "en-asv", "en-web"
 */
export function toWldehVersionPath(versionId: string): string {
  const VERSION_MAP: Record<string, string> = {
    kjv: 'en-kjv',
    asv: 'en-asv',
    web: 'en-web',
    bsb: 'en-bsb',
    lsv: 'en-lsv',
    fbv: 'en-fbv',
  };
  const path = VERSION_MAP[versionId];
  if (!path) {
    throw new Error(`Unknown version ID for wldeh: ${versionId}`);
  }
  return path;
}

/**
 * Map our internal version ID to the helloao translation ID.
 * helloao uses uppercase IDs like "BSB", or "kor_old" for Korean.
 */
export function toHelloaoVersionId(versionId: string): string {
  const VERSION_MAP: Record<string, string> = {
    krv: 'kor_old',
  };
  const id = VERSION_MAP[versionId];
  if (!id) {
    throw new Error(`Unknown version ID for helloao: ${versionId}`);
  }
  return id;
}
