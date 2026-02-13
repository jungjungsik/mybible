import { db } from './index';
import { Highlight } from '@/types/bible';

export async function addHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<string> {
  const id = crypto.randomUUID();
  await db.highlights.add({
    ...highlight,
    id,
    createdAt: Date.now(),
  });
  return id;
}

export async function removeHighlight(id: string): Promise<void> {
  await db.highlights.delete(id);
}

export async function getHighlightsByChapter(book: string, chapter: number): Promise<Highlight[]> {
  return db.highlights.where({ book, chapter }).toArray();
}

export async function getHighlightByVerse(book: string, chapter: number, verse: number): Promise<Highlight | undefined> {
  return db.highlights.where({ book, chapter, verse }).first();
}
