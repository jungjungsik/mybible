'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { getCrossReferences } from '@/lib/constants/crossRefs';
import { getBookById } from '@/lib/constants/books';
import { formatReference } from '@/lib/utils/formatReference';
import { db } from '@/lib/db/index';

interface CrossRefSheetProps {
  isOpen: boolean;
  onClose: () => void;
  source: { book: string; chapter: number; verse: number } | null;
  versionId: string;
}

export function CrossRefSheet({ isOpen, onClose, source, versionId }: CrossRefSheetProps) {
  const router = useRouter();
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const refs = source ? getCrossReferences(source.book, source.chapter, source.verse) : [];

  // Load cached verse text for each cross-ref (best effort)
  useEffect(() => {
    if (!isOpen || refs.length === 0) return;
    let cancelled = false;
    (async () => {
      const ids = refs.map((r) => `${versionId}:${r.book}:${r.chapter}:${r.verse}`);
      try {
        const rows = await db.verseCache.bulkGet(ids);
        if (cancelled) return;
        const next: Record<string, string> = {};
        rows.forEach((row, i) => {
          if (row) next[ids[i]] = row.text;
        });
        setPreviews(next);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, source?.book, source?.chapter, source?.verse, versionId]);

  if (!source) return null;

  const sourceRef = formatReference(source.book, source.chapter, source.verse);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="관련 구절">
      <div className="card mb-4 rounded-xl p-3">
        <p className="font-sans text-bible-accent dark:text-bible-accent-dark font-semibold text-xs mb-1">
          {sourceRef}
        </p>
        <p className="font-sans text-xs text-bible-text/60 dark:text-bible-text-dark/60">
          이 구절과 주제적으로 연결된 말씀입니다.
        </p>
      </div>

      {refs.length === 0 ? (
        <div className="py-8 text-center text-sm font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
          이 구절에 대한 큐레이션된 관련 구절이 아직 없습니다.
        </div>
      ) : (
        <div className="space-y-1">
          {refs.map((r) => {
            const book = getBookById(r.book);
            const id = `${versionId}:${r.book}:${r.chapter}:${r.verse}`;
            const preview = previews[id];
            const refLabel = `${book?.name ?? r.book} ${r.chapter}:${r.verse}`;
            return (
              <button
                key={`${r.book}-${r.chapter}-${r.verse}`}
                onClick={() => {
                  router.push(`/read/${r.book}/${r.chapter}?verse=${r.verse}`);
                  onClose();
                }}
                className="w-full text-left card p-3 rounded-xl hover:shadow-warm-lg transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 text-bible-accent dark:text-bible-accent-dark font-display font-semibold text-sm">
                    <BookOpen size={12} />
                    {refLabel}
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-bible-text-secondary/40 dark:text-bible-text-secondary-dark/40"
                  />
                </div>
                {preview && (
                  <p className="font-serif text-sm text-bible-text/80 dark:text-bible-text-dark/80 leading-relaxed">
                    {preview.length > 120 ? preview.slice(0, 120) + '…' : preview}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </BottomSheet>
  );
}
