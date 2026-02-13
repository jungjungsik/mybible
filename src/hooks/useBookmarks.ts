'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';
import { addBookmark, removeBookmark, getBookmarkByVerse } from '@/lib/db/bookmarks';
import { useCallback } from 'react';

export function useBookmarks() {
  const bookmarks = useLiveQuery(
    () => db.bookmarks.toArray(),
    [],
    []
  );
  return bookmarks;
}

export function useAllBookmarks() {
  const bookmarks = useLiveQuery(
    () => db.bookmarks.reverse().sortBy('createdAt'),
    [],
    []
  );
  return bookmarks;
}

export function useChapterBookmarks(book: string, chapter: number) {
  const bookmarks = useLiveQuery(
    () => db.bookmarks.where({ book, chapter }).toArray(),
    [book, chapter],
    []
  );
  return bookmarks;
}

export function useToggleBookmark() {
  const toggleBookmark = useCallback(async (
    book: string,
    chapter: number,
    verse: number,
    label?: string
  ) => {
    const existing = await getBookmarkByVerse(book, chapter, verse);
    if (existing) {
      await removeBookmark(existing.id);
      return false; // removed
    } else {
      await addBookmark({ book, chapter, verse, label });
      return true; // added
    }
  }, []);

  return { toggleBookmark };
}
