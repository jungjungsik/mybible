'use client';

import { RefObject } from 'react';
import { Bookmark, StickyNote } from 'lucide-react';
import { BibleVerse, Highlight } from '@/types/bible';
import { getHighlightBgClass } from '@/lib/constants/colors';
import clsx from 'clsx';

interface VerseDisplayProps {
  verse: BibleVerse;
  highlight?: Highlight;
  isBookmarked: boolean;
  hasMemo: boolean;
  fontSize: number;
  onTap: (verse: BibleVerse) => void;
  verseRef?: RefObject<HTMLDivElement>;
  isPulsing?: boolean;
  isActive?: boolean;
}

export function VerseDisplay({
  verse,
  highlight,
  isBookmarked,
  hasMemo,
  fontSize,
  onTap,
  verseRef,
  isPulsing = false,
  isActive = false,
}: VerseDisplayProps) {
  const highlightClass = highlight ? getHighlightBgClass(highlight.color) : '';

  return (
    <div
      ref={verseRef}
      className={clsx(
        'py-1 cursor-pointer select-text rounded-md transition-all duration-200',
        highlightClass && `${highlightClass} rounded-md`,
        isPulsing && 'animate-pulse-highlight',
        isActive && 'verse-active'
      )}
      onClick={() => onTap(verse)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTap(verse);
        }
      }}
    >
      <span
        className="text-bible-verse-num dark:text-bible-verse-num-dark font-sans text-[10px] font-semibold opacity-70 align-super mr-1.5"
      >
        {verse.verse}
      </span>
      <span
        className="font-serif leading-[2.0]"
        style={{ fontSize: `${fontSize}px` }}
      >
        {verse.text}
      </span>
      {isBookmarked && (
        <Bookmark
          size={14}
          className="inline-block ml-1 text-bible-gold align-middle"
          fill="currentColor"
        />
      )}
      {hasMemo && (
        <StickyNote
          size={14}
          className="inline-block ml-1 text-bible-accent dark:text-bible-accent-dark align-middle"
        />
      )}
    </div>
  );
}
