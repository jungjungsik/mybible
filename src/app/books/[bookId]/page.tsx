'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ErrorState } from '@/components/ui/ErrorState';
import { getBookById } from '@/lib/constants/books';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';
import clsx from 'clsx';

interface ChapterSelectionPageProps {
  params: { bookId: string };
}

export default function ChapterSelectionPage({ params }: ChapterSelectionPageProps) {
  const { bookId } = params;
  const book = getBookById(bookId);

  // Get all read chapters for this book
  const readChapters = useLiveQuery(
    async () => {
      if (!book) return new Set<number>();
      const records = await db.readingProgress.where('book').equals(bookId).toArray();
      return new Set(records.map((r) => r.chapter));
    },
    [bookId],
    new Set<number>()
  );

  if (!book) {
    return (
      <>
        <Header title="오류" showBack />
        <ErrorState message="존재하지 않는 성경입니다" />
      </>
    );
  }

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <>
      <Header title={book.name} showBack />

      <div className="grid grid-cols-6 gap-2.5 p-4">
        {chapters.map((ch) => {
          const isRead = readChapters.has(ch);

          return (
            <Link
              key={ch}
              href={`/read/${bookId}/${ch}`}
              className={clsx(
                'flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-sm font-sans font-medium transition-all duration-200 hover:shadow-warm hover:scale-[1.02]',
                isRead
                  ? 'bg-bible-accent/15 text-bible-accent border border-bible-accent/20'
                  : 'bg-bible-surface dark:bg-bible-surface-dark border border-bible-border/50 dark:border-bible-border-dark/50 text-bible-text dark:text-bible-text-dark'
              )}
            >
              {ch}
            </Link>
          );
        })}
      </div>
    </>
  );
}
