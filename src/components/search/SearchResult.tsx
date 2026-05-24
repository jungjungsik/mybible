'use client';

import { BibleVerse, SearchResultItem } from '@/types/bible';
import { formatReference } from '@/lib/utils/formatReference';

interface SearchResultProps {
  item: SearchResultItem;
  query: string;
  onClick: () => void;
}

export function SearchResult({ item, query, onClick }: SearchResultProps) {
  const { verse, contextBefore, contextAfter } = item;
  const reference = formatReference(verse.book, verse.chapter, verse.verse);

  return (
    <div
      onClick={onClick}
      className="card p-4 cursor-pointer hover:shadow-warm-lg hover:border-bible-accent/50 dark:hover:border-bible-accent/50 transition-all"
    >
      <div className="text-sm font-display font-semibold text-bible-accent mb-2">
        {reference}
      </div>

      {contextBefore && <ContextLine verse={contextBefore} />}

      <div className="text-base font-serif leading-relaxed text-bible-text dark:text-bible-text-dark">
        <span className="text-xs font-sans font-semibold text-bible-accent/70 mr-1.5 align-top">
          {verse.verse}
        </span>
        {highlightText(verse.text, query)}
      </div>

      {contextAfter && <ContextLine verse={contextAfter} />}
    </div>
  );
}

function ContextLine({ verse }: { verse: BibleVerse }) {
  return (
    <div className="text-sm font-serif leading-relaxed text-bible-text/45 dark:text-bible-text-dark/45 my-1">
      <span className="text-[10px] font-sans mr-1 align-top">
        {verse.verse}
      </span>
      {verse.text}
    </div>
  );
}

// Highlight ALL matching segments (multi-word aware)
function highlightText(text: string, searchQuery: string): React.ReactNode {
  if (!searchQuery.trim()) return text;

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
}
