'use client';

import { useState, useEffect, useRef } from 'react';
import { BibleVerse } from '@/types/bible';
import { searchBible } from '@/lib/api/bibleApi';

interface UseSearchResult {
  results: BibleVerse[];
  isSearching: boolean;
  error: string | null;
}

/**
 * React hook for debounced Bible search.
 *
 * Searches through cached chapters for matching verses.
 * Debounces input by 300ms to avoid excessive calls.
 */
export function useSearch(
  versionId: string,
  query: string,
  enabled: boolean = true
): UseSearchResult {
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !query || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    setIsSearching(true);

    // Clear previous debounce timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchBible(versionId, query);
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [versionId, query, enabled]);

  return { results, isSearching, error };
}
