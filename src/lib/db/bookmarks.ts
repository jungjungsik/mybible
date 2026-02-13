import { db } from './index';
import { Bookmark } from '@/types/bible';

export async function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<string> {
  const id = crypto.randomUUID();
  await db.bookmarks.add({
    ...bookmark,
    id,
    createdAt: Date.now(),
  });
  return id;
}

export async function removeBookmark(id: string): Promise<void> {
  await db.bookmarks.delete(id);
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  return db.bookmarks.reverse().sortBy('createdAt');
}

export async function getBookmarksByChapter(book: string, chapter: number): Promise<Bookmark[]> {
  return db.bookmarks.where({ book, chapter }).toArray();
}

export async function isBookmarked(book: string, chapter: number, verse: number): Promise<boolean> {
  const count = await db.bookmarks.where({ book, chapter, verse }).count();
  return count > 0;
}

export async function getBookmarkByVerse(book: string, chapter: number, verse: number): Promise<Bookmark | undefined> {
  return db.bookmarks.where({ book, chapter, verse }).first();
}
