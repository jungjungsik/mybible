import { db } from './index';
import { Note } from '@/types/bible';

export async function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const id = crypto.randomUUID();
  const now = Date.now();
  await db.notes.add({
    ...note,
    id,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
  await db.notes.update(id, { ...updates, updatedAt: Date.now() });
}

export async function deleteNote(id: string): Promise<void> {
  await db.notes.delete(id);
}

export async function getNotesByChapter(book: string, chapter: number): Promise<Note[]> {
  return db.notes.where({ book, chapter }).toArray();
}

export async function getNotesByVerse(book: string, chapter: number, verse: number): Promise<Note[]> {
  return db.notes.where({ book, chapter, verse }).toArray();
}

export async function getSermonNotes(): Promise<Note[]> {
  return db.notes.where('type').equals('sermon').reverse().sortBy('createdAt');
}

export async function getAllNotes(): Promise<Note[]> {
  return db.notes.reverse().sortBy('createdAt');
}

export async function searchNotes(query: string): Promise<Note[]> {
  const lowerQuery = query.toLowerCase();
  return db.notes.filter(note =>
    note.content.toLowerCase().includes(lowerQuery) ||
    (note.title?.toLowerCase().includes(lowerQuery) ?? false)
  ).toArray();
}

export async function getNoteById(id: string): Promise<Note | undefined> {
  return db.notes.get(id);
}
