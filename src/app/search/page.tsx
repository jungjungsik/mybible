'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SearchResult } from '@/components/search/SearchResult';
import { VersionSelector } from '@/components/bible/VersionSelector';
import { useSearch } from '@/hooks/useSearch';
import { parseReference } from '@/lib/constants/books';
import { formatReference } from '@/lib/utils/formatReference';
import { Search, X, Clock, ArrowRight } from 'lucide-react';

const RECENT_SEARCHES_KEY = 'bible-recent-searches';
const MAX_RECENT_SEARCHES = 10;

export default function SearchPage() {
  const router = useRouter();
  const [version, setVersion] = useState('krv');
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Parse reference if input matches a verse reference
  const parsedReference = query.trim() ? parseReference(query) : null;

  // Perform search only if query is >= 2 chars and not a valid reference
  const shouldSearch = query.length >= 2 && !parsedReference;
  const { results, isSearching, error } = useSearch(version, query, shouldSearch);

  const addToRecentSearches = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length >= 2) {
      addToRecentSearches(searchQuery);
    }
  };

  const handleVerseClick = (book: string, chapter: number, verse: number) => {
    router.push(`/read/${book}/${chapter}?verse=${verse}`);
  };

  const handleReferenceClick = () => {
    if (!parsedReference) return;
    const url = parsedReference.verse
      ? `/read/${parsedReference.book}/${parsedReference.chapter}?verse=${parsedReference.verse}`
      : `/read/${parsedReference.book}/${parsedReference.chapter}`;
    router.push(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark">
      <Header
        title="검색"
        showBack
        rightActions={<VersionSelector currentVersion={version} onVersionChange={setVersion} />}
      />

      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="구절을 검색하거나 참조를 입력하세요 (예: 요 3:16, 하나님)"
            className="card w-full pl-10 pr-10 py-3.5 text-base font-sans rounded-2xl border-bible-border/50 dark:border-bible-border-dark/50 focus:outline-none focus:ring-2 focus:ring-bible-accent/50 focus:border-bible-accent"
          />
          <Search
            size={20}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bible-text-secondary dark:text-bible-text-secondary-dark"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-bible-surface dark:hover:bg-bible-surface-dark rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X size={18} className="text-bible-text-secondary dark:text-bible-text-secondary-dark" />
            </button>
          )}
        </div>

        {/* Quick Jump Card - if input is a valid reference */}
        {parsedReference && (
          <div
            onClick={handleReferenceClick}
            className="card p-4 cursor-pointer hover:shadow-warm-lg transition-all flex items-center justify-between"
          >
            <div>
              <span className="bg-bible-accent/10 text-bible-accent rounded-full px-3 py-1 font-sans text-sm font-medium">
                바로가기
              </span>
              <div className="text-base font-serif font-semibold text-bible-text dark:text-bible-text-dark mt-2">
                {formatReference(
                  parsedReference.book,
                  parsedReference.chapter,
                  parsedReference.verse
                )}{' '}
                으로 이동
              </div>
            </div>
            <ArrowRight size={20} className="text-bible-accent" />
          </div>
        )}

        {/* Loading */}
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bible-accent" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8 text-red-500 dark:text-red-400 font-sans">
            {error}
          </div>
        )}

        {/* Search Results */}
        {!parsedReference && query.length >= 2 && !isSearching && (
          <div className="flex flex-col gap-3">
            {results.length === 0 ? (
              <div className="text-center py-12 text-bible-text-secondary dark:text-bible-text-secondary-dark font-sans">
                검색 결과 없음
              </div>
            ) : (
              results.map((verse) => (
                <SearchResult
                  key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                  verse={verse}
                  query={query}
                  onClick={() => handleVerseClick(verse.book, verse.chapter, verse.verse)}
                />
              ))
            )}
          </div>
        )}

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-sans font-semibold text-bible-text-secondary dark:text-bible-text-secondary-dark flex items-center gap-2">
                <Clock size={16} />
                최근 검색
              </h2>
              <button
                onClick={clearRecentSearches}
                className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark hover:text-bible-accent dark:hover:text-bible-accent transition-colors"
              >
                전체 삭제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((recentQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(recentQuery)}
                  className="px-3 py-1.5 text-sm font-sans bg-bible-surface dark:bg-bible-surface-dark border border-bible-border/50 dark:border-bible-border-dark/50 hover:shadow-warm rounded-full transition-all"
                >
                  {recentQuery}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
