import { getBookById } from '@/lib/constants/books';

export function formatReference(bookId: string, chapter: number, verse?: number): string {
  const book = getBookById(bookId);
  if (!book) return '';

  if (verse) {
    return `${book.name} ${chapter}:${verse}`;
  }
  return `${book.name} ${chapter}장`;
}

export function formatReferenceShort(bookId: string, chapter: number, verse?: number): string {
  const book = getBookById(bookId);
  if (!book) return '';

  if (verse) {
    return `${book.shortName} ${chapter}:${verse}`;
  }
  return `${book.shortName} ${chapter}`;
}
