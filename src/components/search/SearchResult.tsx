'use client';

import { BibleVerse } from '@/types/bible';
import { formatReference } from '@/lib/utils/formatReference';

interface SearchResultProps {
  verse: BibleVerse;
  query: string;
  onClick: () => void;
}

export function SearchResult({ verse, query, onClick }: SearchResultProps) {
  const reference = formatReference(verse.book, verse.chapter, verse.verse);

  // Highlight matching text in the verse
  const highlightText = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-yellow-200 dark:bg-yellow-700/50 font-medium">
          {text.slice(index, index + searchQuery.length)}
        </mark>
        {text.slice(index + searchQuery.length)}
      </>
    );
  };

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:shadow-md hover:border-bible-accent/50 dark:hover:border-bible-accent/50 transition-all"
    >
      <div className="text-sm font-semibold text-bible-accent mb-1">
        {reference}
      </div>
      <div className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
        {highlightText(verse.text, query)}
      </div>
    </div>
  );
}
