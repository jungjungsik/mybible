'use client';

import { useState, useEffect, useRef } from 'react';
import { BibleVerse } from '@/types/bible';
import { searchBible, SearchScope } from '@/lib/api/bibleApi';

interface UseSearchResult {
  results: BibleVerse[];
  totalFound: number;
  isSearching: boolean;
  error: string | null;
}

/**
 * React hook for debounced Bible search with scope and limit.
 *
 * Searches through cached chapters for matching verses.
 * Debounces input by 300ms to avoid excessive calls.
 */
export function useSearch(
  versionId: string,
  query: string,
  enabled: boolean = true,
  scope: SearchScope = 'all',
  limit: number = 30
): UseSearchResult {
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !query || query.length < 2) {
      setResults([]);
      setTotalFound(0);
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
        const data = await searchBible(versionId, query, scope, limit);
        setResults(data.results);
        setTotalFound(data.totalFound);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
        setTotalFound(0);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [versionId, query, enabled, scope, limit]);

  return { results, totalFound, isSearching, error };
}
