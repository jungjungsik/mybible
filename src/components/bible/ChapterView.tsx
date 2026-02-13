'use client';

import { useEffect, useRef, createRef, RefObject } from 'react';
import { BibleChapter, BibleVerse, Highlight, Bookmark, Note } from '@/types/bible';
import { VerseDisplay } from './VerseDisplay';

interface ChapterViewProps {
  chapter: BibleChapter;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  notes: Note[];
  fontSize: number;
  onVerseTap: (verse: BibleVerse) => void;
  scrollToVerse?: number;
  activeVerseIndex?: number | null;
}

export function ChapterView({
  chapter,
  highlights,
  bookmarks,
  notes,
  fontSize,
  onVerseTap,
  scrollToVerse,
  activeVerseIndex,
}: ChapterViewProps) {
  const verseRefs = useRef<Map<number, RefObject<HTMLDivElement>>>(new Map());

  // Ensure refs exist for all verses
  for (const v of chapter.verses) {
    if (!verseRefs.current.has(v.verse)) {
      verseRefs.current.set(v.verse, createRef<HTMLDivElement>());
    }
  }

  useEffect(() => {
    if (scrollToVerse) {
      const ref = verseRefs.current.get(scrollToVerse);
      if (ref?.current) {
        // Small delay to let layout settle
        const timer = setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [scrollToVerse, chapter]);

  // Auto-scroll to active verse (TTS)
  useEffect(() => {
    if (activeVerseIndex !== null && activeVerseIndex !== undefined) {
      const verse = chapter.verses[activeVerseIndex];
      if (verse) {
        const ref = verseRefs.current.get(verse.verse);
        if (ref?.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [activeVerseIndex, chapter.verses]);

  return (
    <div className="px-5 py-4 space-y-0">
      {chapter.verses.map((verse, index) => {
        const highlight = highlights.find(
          (h) => h.verse === verse.verse
        );
        const isBookmarked = bookmarks.some(
          (b) => b.verse === verse.verse
        );
        const hasMemo = notes.some(
          (n) => n.verse === verse.verse
        );
        const ref = verseRefs.current.get(verse.verse);
        const isActive = activeVerseIndex !== null && activeVerseIndex !== undefined && activeVerseIndex === index;

        return (
          <VerseDisplay
            key={verse.verse}
            verse={verse}
            highlight={highlight}
            isBookmarked={isBookmarked}
            hasMemo={hasMemo}
            fontSize={fontSize}
            onTap={onVerseTap}
            verseRef={ref}
            isPulsing={scrollToVerse === verse.verse}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
}
