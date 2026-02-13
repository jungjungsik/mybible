import Dexie, { Table } from 'dexie';
import { Note, Highlight, Bookmark, ReadingProgress, ReadingSession } from '@/types/bible';

export interface SettingsRecord {
  key: string;
  value: unknown;
}

export interface CachedVerse {
  id: string;          // versionId:book:chapter:verse
  version: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export class ILoveBibleDB extends Dexie {
  notes!: Table<Note, string>;
  highlights!: Table<Highlight, string>;
  bookmarks!: Table<Bookmark, string>;
  readingProgress!: Table<ReadingProgress, string>;
  settings!: Table<SettingsRecord, string>;
  verseCache!: Table<CachedVerse, string>;
  readingSessions!: Table<ReadingSession, string>;

  constructor() {
    super('MyBibleDB');
    this.version(1).stores({
      notes: 'id, type, book, chapter, verse, date, createdAt',
      highlights: 'id, book, chapter, verse, version, createdAt',
      bookmarks: 'id, book, chapter, verse, createdAt',
      readingProgress: 'id, book, chapter, completedAt',
      settings: 'key'
    });
    this.version(2).stores({
      notes: 'id, type, [book+chapter], [book+chapter+verse], date, createdAt',
      highlights: 'id, [book+chapter], [book+chapter+verse], version, createdAt',
      bookmarks: 'id, [book+chapter], [book+chapter+verse], createdAt',
      readingProgress: 'id, [book+chapter], completedAt',
      settings: 'key'
    });
    this.version(3).stores({
      notes: 'id, type, [book+chapter], [book+chapter+verse], date, createdAt',
      highlights: 'id, [book+chapter], [book+chapter+verse], version, createdAt',
      bookmarks: 'id, [book+chapter], [book+chapter+verse], createdAt',
      readingProgress: 'id, [book+chapter], completedAt',
      settings: 'key',
      verseCache: 'id, version, [version+book+chapter], text'
    });
    this.version(4).stores({
      notes: 'id, type, [book+chapter], [book+chapter+verse], date, createdAt',
      highlights: 'id, [book+chapter], [book+chapter+verse], version, createdAt',
      bookmarks: 'id, [book+chapter], [book+chapter+verse], createdAt',
      readingProgress: 'id, [book+chapter], completedAt',
      settings: 'key',
      verseCache: 'id, version, [version+book+chapter], text',
      readingSessions: 'id, date, book, [book+chapter], startedAt'
    });
  }
}

export const db = new ILoveBibleDB();
