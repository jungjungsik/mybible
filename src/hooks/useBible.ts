'use client';

import { useState, useEffect, useCallback } from 'react';
import { BibleChapter } from '@/types/bible';
import { fetchChapter } from '@/lib/api/bibleApi';

interface UseBibleResult {
  data: BibleChapter | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * React hook for fetching a Bible chapter.
 *
 * Automatically fetches when version, book, or chapter changes.
 * Cancels in-flight requests on unmount or dependency change.
 */
export function useBible(
  versionId: string,
  bookId: string,
  chapter: number
): UseBibleResult {
  const [data, setData] = useState<BibleChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!versionId || !bookId || !chapter) return;

      setData(null);
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchChapter(versionId, bookId, chapter, signal);
        if (!signal?.aborted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load chapter'
          );
          setIsLoading(false);
        }
      }
    },
    [versionId, bookId, chapter]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const refetch = useCallback(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refetch };
}
