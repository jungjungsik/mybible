import Dexie, { Table } from 'dexie';
import { Note, Highlight, Bookmark, ReadingProgress } from '@/types/bible';

export interface SettingsRecord {
  key: string;
  value: unknown;
}

export class MyBibleDB extends Dexie {
  notes!: Table<Note, string>;
  highlights!: Table<Highlight, string>;
  bookmarks!: Table<Bookmark, string>;
  readingProgress!: Table<ReadingProgress, string>;
  settings!: Table<SettingsRecord, string>;

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
  }
}

export const db = new MyBibleDB();
