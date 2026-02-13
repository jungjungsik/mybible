'use client';

import { useState, useEffect } from 'react';
import { fetchChapter } from '@/lib/api/bibleApi';
import { BibleChapter, BibleVerse } from '@/types/bible';
import { getVersionById } from '@/lib/constants/versions';
import { Skeleton } from '@/components/ui/Skeleton';

interface VersionCompareProps {
  bookId: string;
  chapter: number;
  verse: number;
  versions: string[];
}

interface VersionData {
  versionId: string;
  verse: BibleVerse | null;
  isLoading: boolean;
  error: string | null;
}

export function VersionCompare({ bookId, chapter, verse, versions }: VersionCompareProps) {
  const [versionData, setVersionData] = useState<VersionData[]>(
    versions.map(versionId => ({
      versionId,
      verse: null,
      isLoading: true,
      error: null,
    }))
  );

  useEffect(() => {
    const controllers = versions.map(() => new AbortController());

    // Fetch all versions in parallel
    versions.forEach((versionId, index) => {
      const signal = controllers[index].signal;

      fetchChapter(versionId, bookId, chapter, signal)
        .then((data: BibleChapter) => {
          // Find the specific verse
          const foundVerse = data.verses.find(v => v.verse === verse);

          setVersionData(prev => {
            const updated = [...prev];
            updated[index] = {
              versionId,
              verse: foundVerse || null,
              isLoading: false,
              error: foundVerse ? null : `Verse ${verse} not found`,
            };
            return updated;
          });
        })
        .catch((err) => {
          if (!signal.aborted) {
            setVersionData(prev => {
              const updated = [...prev];
              updated[index] = {
                versionId,
                verse: null,
                isLoading: false,
                error: err instanceof Error ? err.message : 'Failed to load verse',
              };
              return updated;
            });
          }
        });
    });

    return () => {
      controllers.forEach(controller => controller.abort());
    };
  }, [bookId, chapter, verse, versions]);

  return (
    <div className="space-y-4">
      {versionData.map((data) => {
        const version = getVersionById(data.versionId);
        const versionName = version?.shortName || data.versionId;

        return (
          <div
            key={data.versionId}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-800"
          >
            {/* Version badge */}
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-bible-accent/10 text-bible-accent dark:bg-bible-accent/20">
                {versionName}
              </span>
            </div>

            {/* Verse content */}
            {data.isLoading ? (
              <Skeleton lines={2} />
            ) : data.error ? (
              <p className="text-sm text-red-500 dark:text-red-400">{data.error}</p>
            ) : data.verse ? (
              <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                {data.verse.text}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No verse found</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
