import { BibleBook, ParsedReference } from '@/types/bible';

// ============================================================================
// 66 Bible Books — accurate chapter counts
// ============================================================================

export const BIBLE_BOOKS: BibleBook[] = [
  // ── Old Testament (39 books) ──
  { id: 'GEN', name: '창세기',       englishName: 'Genesis',         shortName: '창',  testament: 'old', chapters: 50,  order: 1  },
  { id: 'EXO', name: '출애굽기',     englishName: 'Exodus',          shortName: '출',  testament: 'old', chapters: 40,  order: 2  },
  { id: 'LEV', name: '레위기',       englishName: 'Leviticus',       shortName: '레',  testament: 'old', chapters: 27,  order: 3  },
  { id: 'NUM', name: '민수기',       englishName: 'Numbers',         shortName: '민',  testament: 'old', chapters: 36,  order: 4  },
  { id: 'DEU', name: '신명기',       englishName: 'Deuteronomy',     shortName: '신',  testament: 'old', chapters: 34,  order: 5  },
  { id: 'JOS', name: '여호수아',     englishName: 'Joshua',          shortName: '수',  testament: 'old', chapters: 24,  order: 6  },
  { id: 'JDG', name: '사사기',       englishName: 'Judges',          shortName: '삿',  testament: 'old', chapters: 21,  order: 7  },
  { id: 'RUT', name: '룻기',         englishName: 'Ruth',            shortName: '룻',  testament: 'old', chapters: 4,   order: 8  },
  { id: '1SA', name: '사무엘상',     englishName: '1 Samuel',        shortName: '삼상', testament: 'old', chapters: 31,  order: 9  },
  { id: '2SA', name: '사무엘하',     englishName: '2 Samuel',        shortName: '삼하', testament: 'old', chapters: 24,  order: 10 },
  { id: '1KI', name: '열왕기상',     englishName: '1 Kings',         shortName: '왕상', testament: 'old', chapters: 22,  order: 11 },
  { id: '2KI', name: '열왕기하',     englishName: '2 Kings',         shortName: '왕하', testament: 'old', chapters: 25,  order: 12 },
  { id: '1CH', name: '역대상',       englishName: '1 Chronicles',    shortName: '대상', testament: 'old', chapters: 29,  order: 13 },
  { id: '2CH', name: '역대하',       englishName: '2 Chronicles',    shortName: '대하', testament: 'old', chapters: 36,  order: 14 },
  { id: 'EZR', name: '에스라',       englishName: 'Ezra',            shortName: '스',  testament: 'old', chapters: 10,  order: 15 },
  { id: 'NEH', name: '느헤미야',     englishName: 'Nehemiah',        shortName: '느',  testament: 'old', chapters: 13,  order: 16 },
  { id: 'EST', name: '에스더',       englishName: 'Esther',          shortName: '에',  testament: 'old', chapters: 10,  order: 17 },
  { id: 'JOB', name: '욥기',         englishName: 'Job',             shortName: '욥',  testament: 'old', chapters: 42,  order: 18 },
  { id: 'PSA', name: '시편',         englishName: 'Psalms',          shortName: '시',  testament: 'old', chapters: 150, order: 19 },
  { id: 'PRO', name: '잠언',         englishName: 'Proverbs',        shortName: '잠',  testament: 'old', chapters: 31,  order: 20 },
  { id: 'ECC', name: '전도서',       englishName: 'Ecclesiastes',    shortName: '전',  testament: 'old', chapters: 12,  order: 21 },
  { id: 'SNG', name: '아가',         englishName: 'Song of Solomon', shortName: '아',  testament: 'old', chapters: 8,   order: 22 },
  { id: 'ISA', name: '이사야',       englishName: 'Isaiah',          shortName: '사',  testament: 'old', chapters: 66,  order: 23 },
  { id: 'JER', name: '예레미야',     englishName: 'Jeremiah',        shortName: '렘',  testament: 'old', chapters: 52,  order: 24 },
  { id: 'LAM', name: '예레미야애가', englishName: 'Lamentations',    shortName: '애',  testament: 'old', chapters: 5,   order: 25 },
  { id: 'EZK', name: '에스겔',       englishName: 'Ezekiel',         shortName: '겔',  testament: 'old', chapters: 48,  order: 26 },
  { id: 'DAN', name: '다니엘',       englishName: 'Daniel',          shortName: '단',  testament: 'old', chapters: 12,  order: 27 },
  { id: 'HOS', name: '호세아',       englishName: 'Hosea',           shortName: '호',  testament: 'old', chapters: 14,  order: 28 },
  { id: 'JOL', name: '요엘',         englishName: 'Joel',            shortName: '욜',  testament: 'old', chapters: 3,   order: 29 },
  { id: 'AMO', name: '아모스',       englishName: 'Amos',            shortName: '암',  testament: 'old', chapters: 9,   order: 30 },
  { id: 'OBA', name: '오바댜',       englishName: 'Obadiah',         shortName: '옵',  testament: 'old', chapters: 1,   order: 31 },
  { id: 'JON', name: '요나',         englishName: 'Jonah',           shortName: '욘',  testament: 'old', chapters: 4,   order: 32 },
  { id: 'MIC', name: '미가',         englishName: 'Micah',           shortName: '미',  testament: 'old', chapters: 7,   order: 33 },
  { id: 'NAM', name: '나훔',         englishName: 'Nahum',           shortName: '나',  testament: 'old', chapters: 3,   order: 34 },
  { id: 'HAB', name: '하박국',       englishName: 'Habakkuk',        shortName: '합',  testament: 'old', chapters: 3,   order: 35 },
  { id: 'ZEP', name: '스바냐',       englishName: 'Zephaniah',       shortName: '습',  testament: 'old', chapters: 3,   order: 36 },
  { id: 'HAG', name: '학개',         englishName: 'Haggai',          shortName: '학',  testament: 'old', chapters: 2,   order: 37 },
  { id: 'ZEC', name: '스가랴',       englishName: 'Zechariah',       shortName: '슥',  testament: 'old', chapters: 14,  order: 38 },
  { id: 'MAL', name: '말라기',       englishName: 'Malachi',         shortName: '말',  testament: 'old', chapters: 4,   order: 39 },

  // ── New Testament (27 books) ──
  { id: 'MAT', name: '마태복음',     englishName: 'Matthew',         shortName: '마',  testament: 'new', chapters: 28,  order: 40 },
  { id: 'MRK', name: '마가복음',     englishName: 'Mark',            shortName: '막',  testament: 'new', chapters: 16,  order: 41 },
  { id: 'LUK', name: '누가복음',     englishName: 'Luke',            shortName: '눅',  testament: 'new', chapters: 24,  order: 42 },
  { id: 'JHN', name: '요한복음',     englishName: 'John',            shortName: '요',  testament: 'new', chapters: 21,  order: 43 },
  { id: 'ACT', name: '사도행전',     englishName: 'Acts',            shortName: '행',  testament: 'new', chapters: 28,  order: 44 },
  { id: 'ROM', name: '로마서',       englishName: 'Romans',          shortName: '롬',  testament: 'new', chapters: 16,  order: 45 },
  { id: '1CO', name: '고린도전서',   englishName: '1 Corinthians',   shortName: '고전', testament: 'new', chapters: 16,  order: 46 },
  { id: '2CO', name: '고린도후서',   englishName: '2 Corinthians',   shortName: '고후', testament: 'new', chapters: 13,  order: 47 },
  { id: 'GAL', name: '갈라디아서',   englishName: 'Galatians',       shortName: '갈',  testament: 'new', chapters: 6,   order: 48 },
  { id: 'EPH', name: '에베소서',     englishName: 'Ephesians',       shortName: '엡',  testament: 'new', chapters: 6,   order: 49 },
  { id: 'PHP', name: '빌립보서',     englishName: 'Philippians',     shortName: '빌',  testament: 'new', chapters: 4,   order: 50 },
  { id: 'COL', name: '골로새서',     englishName: 'Colossians',      shortName: '골',  testament: 'new', chapters: 4,   order: 51 },
  { id: '1TH', name: '데살로니가전서', englishName: '1 Thessalonians', shortName: '살전', testament: 'new', chapters: 5, order: 52 },
  { id: '2TH', name: '데살로니가후서', englishName: '2 Thessalonians', shortName: '살후', testament: 'new', chapters: 3, order: 53 },
  { id: '1TI', name: '디모데전서',   englishName: '1 Timothy',       shortName: '딤전', testament: 'new', chapters: 6,  order: 54 },
  { id: '2TI', name: '디모데후서',   englishName: '2 Timothy',       shortName: '딤후', testament: 'new', chapters: 4,  order: 55 },
  { id: 'TIT', name: '디도서',       englishName: 'Titus',           shortName: '딛',  testament: 'new', chapters: 3,   order: 56 },
  { id: 'PHM', name: '빌레몬서',     englishName: 'Philemon',        shortName: '몬',  testament: 'new', chapters: 1,   order: 57 },
  { id: 'HEB', name: '히브리서',     englishName: 'Hebrews',         shortName: '히',  testament: 'new', chapters: 13,  order: 58 },
  { id: 'JAS', name: '야고보서',     englishName: 'James',           shortName: '약',  testament: 'new', chapters: 5,   order: 59 },
  { id: '1PE', name: '베드로전서',   englishName: '1 Peter',         shortName: '벧전', testament: 'new', chapters: 5,  order: 60 },
  { id: '2PE', name: '베드로후서',   englishName: '2 Peter',         shortName: '벧후', testament: 'new', chapters: 3,  order: 61 },
  { id: '1JN', name: '요한일서',     englishName: '1 John',          shortName: '요일', testament: 'new', chapters: 5,  order: 62 },
  { id: '2JN', name: '요한이서',     englishName: '2 John',          shortName: '요이', testament: 'new', chapters: 1,  order: 63 },
  { id: '3JN', name: '요한삼서',     englishName: '3 John',          shortName: '요삼', testament: 'new', chapters: 1,  order: 64 },
  { id: 'JUD', name: '유다서',       englishName: 'Jude',            shortName: '유',  testament: 'new', chapters: 1,   order: 65 },
  { id: 'REV', name: '요한계시록',   englishName: 'Revelation',      shortName: '계',  testament: 'new', chapters: 22,  order: 66 },
];

// ============================================================================
// Name-to-ID lookup maps
// ============================================================================

/** Korean short abbreviation -> book ID */
const KOREAN_SHORT_MAP: Record<string, string> = {
  '창': 'GEN', '출': 'EXO', '레': 'LEV', '민': 'NUM', '신': 'DEU',
  '수': 'JOS', '삿': 'JDG', '룻': 'RUT', '삼상': '1SA', '삼하': '2SA',
  '왕상': '1KI', '왕하': '2KI', '대상': '1CH', '대하': '2CH', '스': 'EZR',
  '느': 'NEH', '에': 'EST', '욥': 'JOB', '시': 'PSA', '잠': 'PRO',
  '전': 'ECC', '아': 'SNG', '사': 'ISA', '렘': 'JER', '애': 'LAM',
  '겔': 'EZK', '단': 'DAN', '호': 'HOS', '욜': 'JOL', '암': 'AMO',
  '옵': 'OBA', '욘': 'JON', '미': 'MIC', '나': 'NAM', '합': 'HAB',
  '습': 'ZEP', '학': 'HAG', '슥': 'ZEC', '말': 'MAL',
  '마': 'MAT', '막': 'MRK', '눅': 'LUK', '요': 'JHN', '행': 'ACT',
  '롬': 'ROM', '고전': '1CO', '고후': '2CO', '갈': 'GAL', '엡': 'EPH',
  '빌': 'PHP', '골': 'COL', '살전': '1TH', '살후': '2TH', '딤전': '1TI',
  '딤후': '2TI', '딛': 'TIT', '몬': 'PHM', '히': 'HEB', '약': 'JAS',
  '벧전': '1PE', '벧후': '2PE', '요일': '1JN', '요이': '2JN', '요삼': '3JN',
  '유': 'JUD', '계': 'REV',
};

/** Korean full name -> book ID */
const KOREAN_FULL_MAP: Record<string, string> = {
  '창세기': 'GEN', '출애굽기': 'EXO', '레위기': 'LEV', '민수기': 'NUM',
  '신명기': 'DEU', '여호수아': 'JOS', '사사기': 'JDG', '룻기': 'RUT',
  '사무엘상': '1SA', '사무엘하': '2SA', '열왕기상': '1KI', '열왕기하': '2KI',
  '역대상': '1CH', '역대하': '2CH', '에스라': 'EZR', '느헤미야': 'NEH',
  '에스더': 'EST', '욥기': 'JOB', '시편': 'PSA', '잠언': 'PRO',
  '전도서': 'ECC', '아가': 'SNG', '이사야': 'ISA', '예레미야': 'JER',
  '예레미야애가': 'LAM', '에스겔': 'EZK', '다니엘': 'DAN', '호세아': 'HOS',
  '요엘': 'JOL', '아모스': 'AMO', '오바댜': 'OBA', '요나': 'JON',
  '미가': 'MIC', '나훔': 'NAM', '하박국': 'HAB', '스바냐': 'ZEP',
  '학개': 'HAG', '스가랴': 'ZEC', '말라기': 'MAL',
  '마태복음': 'MAT', '마가복음': 'MRK', '누가복음': 'LUK', '요한복음': 'JHN',
  '사도행전': 'ACT', '로마서': 'ROM', '고린도전서': '1CO', '고린도후서': '2CO',
  '갈라디아서': 'GAL', '에베소서': 'EPH', '빌립보서': 'PHP', '골로새서': 'COL',
  '데살로니가전서': '1TH', '데살로니가후서': '2TH', '디모데전서': '1TI',
  '디모데후서': '2TI', '디도서': 'TIT', '빌레몬서': 'PHM', '히브리서': 'HEB',
  '야고보서': 'JAS', '베드로전서': '1PE', '베드로후서': '2PE',
  '요한일서': '1JN', '요한이서': '2JN', '요한삼서': '3JN',
  '유다서': 'JUD', '요한계시록': 'REV',
};

/** English name/abbreviation -> book ID (case-insensitive lookup at runtime) */
const ENGLISH_NAME_MAP: Record<string, string> = {
  // Full names
  'genesis': 'GEN', 'exodus': 'EXO', 'leviticus': 'LEV', 'numbers': 'NUM',
  'deuteronomy': 'DEU', 'joshua': 'JOS', 'judges': 'JDG', 'ruth': 'RUT',
  '1 samuel': '1SA', '2 samuel': '2SA', '1 kings': '1KI', '2 kings': '2KI',
  '1 chronicles': '1CH', '2 chronicles': '2CH', 'ezra': 'EZR', 'nehemiah': 'NEH',
  'esther': 'EST', 'job': 'JOB', 'psalms': 'PSA', 'psalm': 'PSA',
  'proverbs': 'PRO', 'ecclesiastes': 'ECC', 'song of solomon': 'SNG',
  'song of songs': 'SNG', 'isaiah': 'ISA', 'jeremiah': 'JER',
  'lamentations': 'LAM', 'ezekiel': 'EZK', 'daniel': 'DAN', 'hosea': 'HOS',
  'joel': 'JOL', 'amos': 'AMO', 'obadiah': 'OBA', 'jonah': 'JON',
  'micah': 'MIC', 'nahum': 'NAM', 'habakkuk': 'HAB', 'zephaniah': 'ZEP',
  'haggai': 'HAG', 'zechariah': 'ZEC', 'malachi': 'MAL',
  'matthew': 'MAT', 'mark': 'MRK', 'luke': 'LUK', 'john': 'JHN',
  'acts': 'ACT', 'romans': 'ROM', '1 corinthians': '1CO', '2 corinthians': '2CO',
  'galatians': 'GAL', 'ephesians': 'EPH', 'philippians': 'PHP', 'colossians': 'COL',
  '1 thessalonians': '1TH', '2 thessalonians': '2TH', '1 timothy': '1TI',
  '2 timothy': '2TI', 'titus': 'TIT', 'philemon': 'PHM', 'hebrews': 'HEB',
  'james': 'JAS', '1 peter': '1PE', '2 peter': '2PE',
  '1 john': '1JN', '2 john': '2JN', '3 john': '3JN',
  'jude': 'JUD', 'revelation': 'REV', 'revelations': 'REV',
  // Common abbreviations
  'gen': 'GEN', 'exo': 'EXO', 'exod': 'EXO', 'lev': 'LEV', 'num': 'NUM',
  'deu': 'DEU', 'deut': 'DEU', 'jos': 'JOS', 'josh': 'JOS', 'jdg': 'JDG',
  'judg': 'JDG', 'rut': 'RUT', '1sa': '1SA', '1sam': '1SA', '2sa': '2SA',
  '2sam': '2SA', '1ki': '1KI', '1kgs': '1KI', '2ki': '2KI', '2kgs': '2KI',
  '1ch': '1CH', '1chr': '1CH', '2ch': '2CH', '2chr': '2CH', 'ezr': 'EZR',
  'neh': 'NEH', 'est': 'EST', 'psa': 'PSA', 'pro': 'PRO', 'prov': 'PRO',
  'ecc': 'ECC', 'eccl': 'ECC', 'sng': 'SNG', 'sos': 'SNG', 'isa': 'ISA',
  'jer': 'JER', 'lam': 'LAM', 'ezk': 'EZK', 'eze': 'EZK', 'dan': 'DAN',
  'hos': 'HOS', 'jol': 'JOL', 'amo': 'AMO', 'oba': 'OBA', 'jon': 'JON',
  'mic': 'MIC', 'nam': 'NAM', 'nah': 'NAM', 'hab': 'HAB', 'zep': 'ZEP',
  'zeph': 'ZEP', 'hag': 'HAG', 'zec': 'ZEC', 'zech': 'ZEC', 'mal': 'MAL',
  'mat': 'MAT', 'matt': 'MAT', 'mrk': 'MRK', 'luk': 'LUK', 'jhn': 'JHN',
  'jn': 'JHN', 'act': 'ACT', 'rom': 'ROM', '1co': '1CO', '1cor': '1CO',
  '2co': '2CO', '2cor': '2CO', 'gal': 'GAL', 'eph': 'EPH', 'php': 'PHP',
  'phil': 'PHP', 'col': 'COL', '1th': '1TH', '1thes': '1TH', '2th': '2TH',
  '2thes': '2TH', '1ti': '1TI', '1tim': '1TI', '2ti': '2TI', '2tim': '2TI',
  'tit': 'TIT', 'phm': 'PHM', 'phlm': 'PHM', 'heb': 'HEB', 'jas': 'JAS',
  '1pe': '1PE', '1pet': '1PE', '2pe': '2PE', '2pet': '2PE',
  '1jn': '1JN', '2jn': '2JN', '3jn': '3JN', 'jud': 'JUD', 'rev': 'REV',
};

// Book IDs as an array for direct ID matching
const BOOK_IDS = BIBLE_BOOKS.map(b => b.id);

// ============================================================================
// Utility functions
// ============================================================================

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(b => b.id === id);
}

export function getBookByShortName(shortName: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(b => b.shortName === shortName);
}

export function getOldTestament(): BibleBook[] {
  return BIBLE_BOOKS.filter(b => b.testament === 'old');
}

export function getNewTestament(): BibleBook[] {
  return BIBLE_BOOKS.filter(b => b.testament === 'new');
}

// ============================================================================
// Reference parsing
// ============================================================================

/**
 * Build a sorted list of all known name tokens for matching.
 * Sorted by length descending so longest match wins (e.g. "요한복음" before "요").
 */
function buildNameEntries(): Array<{ name: string; id: string }> {
  const entries: Array<{ name: string; id: string }> = [];

  // Korean full names
  for (const [name, id] of Object.entries(KOREAN_FULL_MAP)) {
    entries.push({ name, id });
  }
  // Korean short names
  for (const [name, id] of Object.entries(KOREAN_SHORT_MAP)) {
    entries.push({ name, id });
  }
  // English names (stored lowercase)
  for (const [name, id] of Object.entries(ENGLISH_NAME_MAP)) {
    entries.push({ name, id });
  }
  // Book IDs themselves (e.g. "GEN", "JHN")
  for (const id of BOOK_IDS) {
    entries.push({ name: id.toLowerCase(), id });
  }

  // Sort by name length descending — longest match first
  entries.sort((a, b) => b.name.length - a.name.length);
  return entries;
}

const NAME_ENTRIES = buildNameEntries();

/**
 * Parse a Bible reference string into a structured object.
 *
 * Supported formats:
 *   "요 3:16"            → { book: "JHN", chapter: 3, verse: 16 }
 *   "창세기 1장 1절"      → { book: "GEN", chapter: 1, verse: 1 }
 *   "John 3:16"          → { book: "JHN", chapter: 3, verse: 16 }
 *   "Gen 1:1"            → { book: "GEN", chapter: 1, verse: 1 }
 *   "JHN 3:16"           → { book: "JHN", chapter: 3, verse: 16 }
 *   "롬 8"               → { book: "ROM", chapter: 8 }
 *   Invalid              → null
 */
export function parseReference(input: string): ParsedReference | null {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();

  // Step 1: Match book name (longest match first)
  let bookId: string | null = null;
  let remainder = '';

  for (const entry of NAME_ENTRIES) {
    if (lower.startsWith(entry.name)) {
      bookId = entry.id;
      remainder = trimmed.slice(entry.name.length).trim();
      break;
    }
  }

  if (!bookId) return null;

  const book = getBookById(bookId);
  if (!book) return null;

  // Step 2: Extract chapter and verse from remainder
  if (!remainder) return null; // no chapter number at all

  // Normalize Korean separators: "3장 16절" → "3:16", "3장" → "3"
  let normalized = remainder
    .replace(/장\s*/g, ':')
    .replace(/절/g, '')
    .trim();

  // Remove trailing colon if present (e.g. "3:" from "3장")
  if (normalized.endsWith(':')) {
    normalized = normalized.slice(0, -1);
  }

  // Now parse "chapter:verse" or "chapter verse" or "chapter"
  let chapter: number;
  let verse: number | undefined;

  if (normalized.includes(':')) {
    const parts = normalized.split(':');
    if (parts.length !== 2) return null;
    chapter = parseInt(parts[0].trim(), 10);
    const versePart = parts[1].trim();
    if (versePart) {
      verse = parseInt(versePart, 10);
    }
  } else if (/^\d+\s+\d+$/.test(normalized)) {
    // "3 16" format (space-separated)
    const parts = normalized.split(/\s+/);
    chapter = parseInt(parts[0], 10);
    verse = parseInt(parts[1], 10);
  } else if (/^\d+$/.test(normalized)) {
    // chapter only
    chapter = parseInt(normalized, 10);
  } else {
    return null;
  }

  if (isNaN(chapter) || chapter < 1 || chapter > book.chapters) return null;
  if (verse !== undefined && (isNaN(verse) || verse < 1)) return null;

  return { book: bookId, chapter, verse };
}
