'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { getOldTestament, getNewTestament } from '@/lib/constants/books';
import { useSettings } from '@/hooks/useSettings';
import clsx from 'clsx';

type Tab = 'old' | 'new';

export default function BooksPage() {
  const [activeTab, setActiveTab] = useState<Tab>('old');
  const { settings } = useSettings();

  const oldTestament = getOldTestament();
  const newTestament = getNewTestament();
  const books = activeTab === 'old' ? oldTestament : newTestament;

  const lastReadBook = settings.lastRead?.book;

  return (
    <>
      <Header title="성경" />

      {/* Tabs */}
      <div className="flex gap-2 p-3 sticky top-12 z-30 bg-bible-bg dark:bg-bible-bg-dark">
        <button
          onClick={() => setActiveTab('old')}
          className={clsx(
            'flex-1 py-2.5 text-sm font-sans font-medium text-center rounded-xl transition-all duration-200',
            activeTab === 'old'
              ? 'bg-bible-accent text-white shadow-warm'
              : 'text-bible-text-secondary dark:text-bible-text-secondary-dark hover:bg-bible-surface dark:hover:bg-bible-surface-dark'
          )}
        >
          구약
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={clsx(
            'flex-1 py-2.5 text-sm font-sans font-medium text-center rounded-xl transition-all duration-200',
            activeTab === 'new'
              ? 'bg-bible-accent text-white shadow-warm'
              : 'text-bible-text-secondary dark:text-bible-text-secondary-dark hover:bg-bible-surface dark:hover:bg-bible-surface-dark'
          )}
        >
          신약
        </button>
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-4">
        {books.map((book) => {
          const isCurrentlyReading = lastReadBook === book.id;

          return (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className={clsx(
                'card flex items-center justify-center py-3 px-2 rounded-xl text-sm font-serif font-medium transition-all duration-200 hover:shadow-warm hover:-translate-y-0.5',
                isCurrentlyReading
                  ? 'bg-bible-accent text-white border-bible-accent shadow-warm'
                  : 'text-bible-text dark:text-bible-text-dark'
              )}
            >
              {book.shortName}
            </Link>
          );
        })}
      </div>
    </>
  );
}
