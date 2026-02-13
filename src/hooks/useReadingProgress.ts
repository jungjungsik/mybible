'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';
import { markChapterRead as dbMarkChapterRead } from '@/lib/db/readingProgress';
import { getBookById } from '@/lib/constants/books';
import { useCallback } from 'react';

export function useReadingProgress() {
  const progress = useLiveQuery(
    () => db.readingProgress.toArray(),
    [],
    []
  );
  return progress;
}

export function useBookProgress(book: string) {
  const progress = useLiveQuery(
    async () => {
      const bookInfo = getBookById(book);
      if (!bookInfo) return { read: 0, total: 0 };
      const read = await db.readingProgress.where('book').equals(book).count();
      return { read, total: bookInfo.chapters };
    },
    [book],
    { read: 0, total: 0 }
  );
  return progress;
}

export function useRecentReading(limit: number = 5) {
  const recent = useLiveQuery(
    () => db.readingProgress.orderBy('completedAt').reverse().limit(limit).toArray(),
    [limit],
    []
  );
  return recent;
}

export function useMarkChapterRead() {
  const markChapterRead = useCallback(async (book: string, chapter: number) => {
    await dbMarkChapterRead(book, chapter);
  }, []);
  return { markChapterRead };
}
