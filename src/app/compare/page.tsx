'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { QuickJump } from '@/components/bible/QuickJump';
import { VersionCompare } from '@/components/bible/VersionCompare';
import { getAllVersions } from '@/lib/constants/versions';
import { parseReference } from '@/lib/constants/books';
import { formatReference } from '@/lib/utils/formatReference';

function ComparePageContent() {
  const searchParams = useSearchParams();

  // Parse URL parameters
  const urlBook = searchParams.get('book');
  const urlChapter = searchParams.get('chapter');
  const urlVerse = searchParams.get('verse');

  const [selectedReference, setSelectedReference] = useState<{
    bookId: string;
    chapter: number;
    verse: number;
  } | null>(null);

  const [selectedVersions, setSelectedVersions] = useState<string[]>(['krv', 'kjv']);

  const allVersions = getAllVersions();

  // Initialize from URL params on mount
  useEffect(() => {
    if (urlBook && urlChapter && urlVerse) {
      const chapter = parseInt(urlChapter, 10);
      const verse = parseInt(urlVerse, 10);
      if (!isNaN(chapter) && !isNaN(verse)) {
        setSelectedReference({
          bookId: urlBook,
          chapter,
          verse,
        });
      }
    }
  }, [urlBook, urlChapter, urlVerse]);

  const handleVersionToggle = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        // Don't allow unchecking if it's the last one
        if (prev.length === 1) return prev;
        return prev.filter(v => v !== versionId);
      } else {
        // Don't allow more than 4 versions
        if (prev.length >= 4) return prev;
        return [...prev, versionId];
      }
    });
  };

  const referenceLabel = selectedReference
    ? formatReference(selectedReference.bookId, selectedReference.chapter, selectedReference.verse)
    : '구절을 선택하세요';

  return (
    <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark text-bible-text dark:text-bible-text-dark">
      <Header title="버전 비교" showBack={true} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Quick Jump */}
        <section className="card rounded-2xl p-4">
          <h2 className="text-sm font-display font-semibold mb-2 text-bible-text dark:text-bible-text-dark">구절 선택</h2>
          <QuickJump
            onNavigate={() => {
              // When user uses QuickJump, extract the reference from the input
              // Since QuickJump navigates, we need a custom callback
              // For now, we'll handle this via manual input below
            }}
          />
          <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark mt-1">
            또는 아래에서 직접 입력하세요 (예: 요 3:16)
          </p>
        </section>

        {/* Manual reference input */}
        <section>
          <input
            type="text"
            placeholder="구절 입력 (예: 요 3:16)"
            className="card w-full px-4 py-3 text-sm font-sans rounded-2xl border-bible-border/50 dark:border-bible-border-dark/50 focus:outline-none focus:ring-2 focus:ring-bible-accent/50 focus:border-bible-accent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.currentTarget.value.trim();
                const parsed = parseReference(input);
                if (parsed && parsed.verse) {
                  setSelectedReference({
                    bookId: parsed.book,
                    chapter: parsed.chapter,
                    verse: parsed.verse,
                  });
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          {selectedReference && (
            <p className="text-sm font-sans text-bible-accent mt-1">
              선택된 구절: {referenceLabel}
            </p>
          )}
        </section>

        {/* Version selection */}
        <section>
          <h2 className="text-sm font-display font-semibold mb-2 text-bible-text dark:text-bible-text-dark">
            비교할 버전 선택 (최대 4개)
          </h2>
          <div className="space-y-2">
            {allVersions.map(version => {
              const isChecked = selectedVersions.includes(version.id);
              const isDisabled = !isChecked && selectedVersions.length >= 4;
              const isLastChecked = isChecked && selectedVersions.length === 1;

              return (
                <label
                  key={version.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isChecked
                      ? 'border-bible-accent bg-bible-accent/5 dark:bg-bible-accent/10 shadow-warm'
                      : 'border-bible-border dark:border-bible-border-dark bg-bible-surface dark:bg-bible-surface-dark'
                  } ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDisabled || isLastChecked}
                    onChange={() => handleVersionToggle(version.id)}
                    className="w-4 h-4 rounded border-bible-border text-bible-accent focus:ring-bible-accent/50"
                    style={{ accentColor: '#C4956A' }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-sans font-medium text-bible-text dark:text-bible-text-dark">{version.shortName}</div>
                    <div className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">{version.name}</div>
                  </div>
                </label>
              );
            })}
          </div>
          <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark mt-2">
            {selectedVersions.length}/4 버전 선택됨
          </p>
        </section>

        {/* Comparison view */}
        {selectedReference && (
          <section>
            <h2 className="text-sm font-display font-semibold mb-3 text-bible-text dark:text-bible-text-dark">
              비교 결과
            </h2>
            <VersionCompare
              bookId={selectedReference.bookId}
              chapter={selectedReference.chapter}
              verse={selectedReference.verse}
              versions={selectedVersions}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark text-bible-text dark:text-bible-text-dark">
        <Header title="버전 비교" showBack={true} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </main>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
