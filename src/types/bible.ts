// Bible language and source types
export type BibleLanguage = 'ko' | 'en';
export type SourceApi = 'wldeh' | 'helloao';
export type Testament = 'old' | 'new';
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';
export type NoteType = 'verse' | 'sermon';

// Bible version info
export interface BibleVersion {
  id: string;
  name: string;
  shortName: string;
  language: BibleLanguage;
  sourceApi: SourceApi;
}

// Bible book info (66 books)
export interface BibleBook {
  id: string;         // 3-letter uppercase: GEN, EXO, etc.
  name: string;       // Korean: 창세기, 출애굽기
  englishName: string;
  shortName: string;  // Korean abbreviation: 창, 출
  testament: Testament;
  chapters: number;   // total chapter count
  order: number;      // 1-66
}

// Bible verse data
export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

// Bible chapter data
export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
  version: string;
}

// Note (verse memo or sermon note)
export interface Note {
  id: string;
  type: NoteType;
  book: string;
  chapter: number;
  verse?: number;
  title?: string;      // sermon title
  content: string;
  date: string;        // ISO date string
  tags?: string[];
  createdAt: number;   // timestamp
  updatedAt: number;
}

// Highlight
export interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  version: string;
  createdAt: number;
}

// Bookmark
export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  label?: string;
  createdAt: number;
}

// Reading progress
export interface ReadingProgress {
  id: string;
  book: string;
  chapter: number;
  completedAt: number;
}

// App settings
export interface AppSettings {
  currentVersion: string;
  fontSize: number;
  darkMode: boolean;
  speechRate: number;
  lastRead: {
    book: string;
    chapter: number;
  } | null;
}

// Export/Import data schema
export interface ExportData {
  version: 1;
  exportedAt: string;
  notes: Note[];
  highlights: Highlight[];
  bookmarks: Bookmark[];
  readingProgress: ReadingProgress[];
  settings: Array<{ key: string; value: unknown }>;
}

// Parsed reference result
export interface ParsedReference {
  book: string;      // Book ID like "GEN", "JHN"
  chapter: number;
  verse?: number;
}
