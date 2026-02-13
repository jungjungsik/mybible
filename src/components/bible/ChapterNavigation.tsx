'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBookById, BIBLE_BOOKS } from '@/lib/constants/books';

interface ChapterNavigationProps {
  bookId: string;
  chapter: number;
  totalChapters: number;
}

export function ChapterNavigation({ bookId, chapter, totalChapters }: ChapterNavigationProps) {
  const router = useRouter();
  const book = getBookById(bookId);
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);

  // Previous navigation
  const hasPrevChapter = chapter > 1;
  const prevBook = bookIndex > 0 ? BIBLE_BOOKS[bookIndex - 1] : null;

  function handlePrev() {
    if (hasPrevChapter) {
      router.push(`/read/${bookId}/${chapter - 1}`);
    } else if (prevBook) {
      router.push(`/read/${prevBook.id}/${prevBook.chapters}`);
    }
  }

  // Next navigation
  const hasNextChapter = chapter < totalChapters;
  const nextBook = bookIndex < BIBLE_BOOKS.length - 1 ? BIBLE_BOOKS[bookIndex + 1] : null;

  function handleNext() {
    if (hasNextChapter) {
      router.push(`/read/${bookId}/${chapter + 1}`);
    } else if (nextBook) {
      router.push(`/read/${nextBook.id}/1`);
    }
  }

  const canGoPrev = hasPrevChapter || !!prevBook;
  const canGoNext = hasNextChapter || !!nextBook;

  const prevLabel = hasPrevChapter
    ? `${chapter - 1}장`
    : prevBook
      ? `${prevBook.shortName} ${prevBook.chapters}장`
      : '';

  const nextLabel = hasNextChapter
    ? `${chapter + 1}장`
    : nextBook
      ? `${nextBook.shortName} 1장`
      : '';

  return (
    <div className="card mx-4 mb-4 rounded-2xl flex items-center justify-between px-4 py-3">
      {/* Previous */}
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className="flex items-center gap-1 text-sm text-bible-accent dark:text-bible-accent-dark font-sans font-medium disabled:opacity-30 min-w-[80px] transition-opacity"
      >
        {canGoPrev && (
          <>
            <ChevronLeft size={16} />
            <span>{prevLabel}</span>
          </>
        )}
      </button>

      {/* Center: current location */}
      <span className="text-sm text-bible-text/70 dark:text-bible-text-dark/70 font-display font-medium">
        {book?.name ?? bookId} {chapter}장
      </span>

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className="flex items-center gap-1 text-sm text-bible-accent dark:text-bible-accent-dark font-sans font-medium disabled:opacity-30 min-w-[80px] justify-end transition-opacity"
      >
        {canGoNext && (
          <>
            <span>{nextLabel}</span>
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}
