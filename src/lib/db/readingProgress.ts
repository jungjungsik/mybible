import { db } from './index';
import { ReadingProgress } from '@/types/bible';
import { getBookById } from '@/lib/constants/books';

export async function markChapterRead(book: string, chapter: number): Promise<void> {
  // Check if already marked
  const existing = await db.readingProgress.where({ book, chapter }).first();
  if (existing) return;

  await db.readingProgress.add({
    id: crypto.randomUUID(),
    book,
    chapter,
    completedAt: Date.now(),
  });
}

export async function getReadingProgress(): Promise<ReadingProgress[]> {
  return db.readingProgress.toArray();
}

export async function getBookProgress(book: string): Promise<{ read: number; total: number }> {
  const bookInfo = getBookById(book);
  if (!bookInfo) return { read: 0, total: 0 };

  const read = await db.readingProgress.where('book').equals(book).count();
  return { read, total: bookInfo.chapters };
}
