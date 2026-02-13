'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';
import { addHighlight, removeHighlight, getHighlightByVerse } from '@/lib/db/highlights';
import { HighlightColor } from '@/types/bible';
import { useCallback } from 'react';

export function useHighlights(book: string, chapter: number) {
  const highlights = useLiveQuery(
    () => db.highlights.where({ book, chapter }).toArray(),
    [book, chapter],
    []
  );
  return highlights;
}

export function useToggleHighlight() {
  const toggleHighlight = useCallback(async (
    book: string,
    chapter: number,
    verse: number,
    color: HighlightColor,
    version: string
  ) => {
    const existing = await getHighlightByVerse(book, chapter, verse);
    if (existing) {
      if (existing.color === color) {
        // Same color: remove
        await removeHighlight(existing.id);
      } else {
        // Different color: remove old, add new
        await removeHighlight(existing.id);
        await addHighlight({ book, chapter, verse, color, version });
      }
    } else {
      // No highlight: add
      await addHighlight({ book, chapter, verse, color, version });
    }
  }, []);

  return { toggleHighlight };
}
