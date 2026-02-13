'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';
import { addNote as dbAddNote, updateNote as dbUpdateNote, deleteNote as dbDeleteNote } from '@/lib/db/notes';
import { Note } from '@/types/bible';
import { useCallback, useState } from 'react';

export function useNotes(book: string, chapter: number) {
  const notes = useLiveQuery(
    () => db.notes.where({ book, chapter }).toArray(),
    [book, chapter],
    []
  );
  return notes;
}

export function useVerseNotes(book: string, chapter: number, verse: number) {
  const notes = useLiveQuery(
    () => db.notes.where({ book, chapter, verse }).toArray(),
    [book, chapter, verse],
    []
  );
  return notes;
}

export function useSermonNotes() {
  const notes = useLiveQuery(
    () => db.notes.where('type').equals('sermon').reverse().sortBy('createdAt'),
    [],
    []
  );
  return notes;
}

export function useAllVerseNotes() {
  const notes = useLiveQuery(
    () => db.notes.where('type').equals('verse').reverse().sortBy('createdAt'),
    [],
    []
  );
  return notes;
}

export function useAddNote() {
  const [isAdding, setIsAdding] = useState(false);

  const addNote = useCallback(async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsAdding(true);
    try {
      const id = await dbAddNote(note);
      return id;
    } finally {
      setIsAdding(false);
    }
  }, []);

  return { addNote, isAdding };
}

export function useUpdateNote() {
  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    await dbUpdateNote(id, updates);
  }, []);
  return { updateNote };
}

export function useDeleteNote() {
  const deleteNote = useCallback(async (id: string) => {
    await dbDeleteNote(id);
  }, []);
  return { deleteNote };
}
