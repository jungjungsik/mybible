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

  // Highlight ALL matching segments (multi-word aware)
  const highlightText = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;

    // Build regex from all query tokens, escaped for safety
    const tokens = searchQuery
      .trim()
      .split(/\s+/)
      .filter((t) => t.length >= 1)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (tokens.length === 0) return text;

    const splitPattern = new RegExp(`(${tokens.join('|')})`, 'gi');
    const testPattern = new RegExp(`^(?:${tokens.join('|')})$`, 'i');
    const parts = text.split(splitPattern);

    if (parts.length <= 1) return text;

    return (
      <>
        {parts.map((part, i) =>
          testPattern.test(part) ? (
            <mark
              key={i}
              className="bg-yellow-200 dark:bg-yellow-700/50 font-medium rounded-sm px-[1px]"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      onClick={onClick}
      className="card p-4 cursor-pointer hover:shadow-warm-lg hover:border-bible-accent/50 dark:hover:border-bible-accent/50 transition-all"
    >
      <div className="text-sm font-display font-semibold text-bible-accent mb-1">
        {reference}
      </div>
      <div className="text-base font-serif leading-relaxed text-bible-text dark:text-bible-text-dark">
        {highlightText(verse.text, query)}
      </div>
    </div>
  );
}
