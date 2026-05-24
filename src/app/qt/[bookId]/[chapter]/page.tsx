'use client';

import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Eye, Pencil, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { VerseSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { MarkdownView } from '@/components/notes/MarkdownView';
import { useBible } from '@/hooks/useBible';
import { useSettings } from '@/hooks/useSettings';
import { useMarkChapterRead } from '@/hooks/useReadingProgress';
import { useReadingTimer } from '@/hooks/useReadingTimer';
import { db } from '@/lib/db/index';
import { addNote, updateNote } from '@/lib/db/notes';
import { getBookById } from '@/lib/constants/books';
import clsx from 'clsx';

const QT_TEMPLATE =
  '## 관찰 (무엇을 말하는가)\n\n- \n\n## 해석 (무엇을 의미하는가)\n\n- \n\n## 적용 (어떻게 살 것인가)\n\n- \n\n## 기도\n\n';

const QT_TITLE_PREFIX = '묵상';

interface PageProps {
  params: { bookId: string; chapter: string };
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function QTPage({ params }: PageProps) {
  const { bookId, chapter: chapterStr } = params;
  const chapterNum = parseInt(chapterStr, 10);
  const today = todayISO();

  const { settings, isLoading: settingsLoading } = useSettings();
  const { data, isLoading, error, refetch } = useBible(
    settingsLoading ? '' : settings.currentVersion,
    bookId,
    chapterNum
  );
  const { markChapterRead } = useMarkChapterRead();
  useReadingTimer(bookId, chapterNum);

  const book = getBookById(bookId);
  const headerTitle = book ? `묵상 · ${book.name} ${chapterNum}장` : `묵상 · ${bookId} ${chapterNum}`;
  const noteTitle = `${QT_TITLE_PREFIX}: ${book?.name ?? bookId} ${chapterNum}장`;

  // Look up today's QT note for this chapter (live).
  // undefined = loading, null = none, Note = found.
  const existingNote = useLiveQuery(
    async () => {
      const rows = await db.notes
        .where('[book+chapter]')
        .equals([bookId, chapterNum])
        .toArray();
      return (
        rows.find(
          (n) =>
            n.type === 'sermon' &&
            n.date === today &&
            (n.title ?? '').startsWith(QT_TITLE_PREFIX)
        ) ?? null
      );
    },
    [bookId, chapterNum, today]
  );

  const [content, setContent] = useState('');
  const [noteId, setNoteId] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const hasInitialized = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize editor content from existing note or template (once)
  useEffect(() => {
    if (hasInitialized.current) return;
    if (existingNote === undefined) return; // still loading

    if (existingNote) {
      setContent(existingNote.content);
      setNoteId(existingNote.id);
    } else {
      setContent(QT_TEMPLATE);
    }
    hasInitialized.current = true;
  }, [existingNote]);

  // Mark chapter read once data loads
  useEffect(() => {
    if (data) markChapterRead(bookId, chapterNum);
  }, [data, bookId, chapterNum, markChapterRead]);

  // Auto-save 2s after last edit (skip the untouched template)
  useEffect(() => {
    if (!hasInitialized.current) return;
    if (!content || content === QT_TEMPLATE) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        if (noteId) {
          await updateNote(noteId, { content, title: noteTitle });
        } else {
          const id = await addNote({
            type: 'sermon',
            book: bookId,
            chapter: chapterNum,
            title: noteTitle,
            content,
            date: today,
          });
          setNoteId(id);
        }
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, noteId, bookId, chapterNum, noteTitle, today]);

  return (
    <>
      <Header title={headerTitle} showBack />
      <main className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
        {/* Scripture — compact, scrollable */}
        <section className="card p-4 max-h-[40vh] overflow-y-auto">
          {isLoading && !data && <VerseSkeleton />}
          {error && !isLoading && <ErrorState message={error} onRetry={refetch} />}
          {data && (
            <div>
              {data.verses.map((v) => (
                <p
                  key={v.verse}
                  className="font-serif text-sm leading-relaxed mb-2 text-bible-text dark:text-bible-text-dark"
                >
                  <span className="text-xs text-bible-accent font-semibold mr-1.5 align-top">
                    {v.verse}
                  </span>
                  {v.text}
                </p>
              ))}
            </div>
          )}
        </section>

        {/* QT note */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-bible-accent" />
              <h2 className="font-display text-sm font-semibold text-bible-text dark:text-bible-text-dark">
                오늘의 묵상
              </h2>
            </div>
            <ModeToggle mode={mode} setMode={setMode} />
          </div>

          {mode === 'edit' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={18}
              placeholder={QT_TEMPLATE}
              className="font-serif w-full p-4 text-base leading-relaxed border border-bible-border dark:border-bible-border-dark rounded-xl bg-white dark:bg-bible-surface-dark focus:outline-none focus:ring-2 focus:ring-bible-accent/50 focus:border-bible-accent resize-none"
            />
          ) : (
            <div className="w-full p-4 min-h-[400px] border border-bible-border dark:border-bible-border-dark rounded-xl bg-white dark:bg-bible-surface-dark">
              <MarkdownView content={content} />
            </div>
          )}

          {isSaving && (
            <p className="text-xs text-bible-text-secondary dark:text-bible-text-secondary-dark text-center">
              자동 저장 중...
            </p>
          )}
        </section>
      </main>
    </>
  );
}

function ModeToggle({
  mode,
  setMode,
}: {
  mode: 'edit' | 'preview';
  setMode: (m: 'edit' | 'preview') => void;
}) {
  return (
    <div className="flex items-center gap-1 p-0.5 bg-bible-surface dark:bg-bible-surface-dark rounded-lg">
      <button
        type="button"
        onClick={() => setMode('edit')}
        className={clsx(
          'flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-md transition-colors',
          mode === 'edit'
            ? 'bg-white dark:bg-bible-bg-dark text-bible-accent shadow-sm'
            : 'text-bible-text-secondary dark:text-bible-text-secondary-dark'
        )}
      >
        <Pencil size={11} />
        편집
      </button>
      <button
        type="button"
        onClick={() => setMode('preview')}
        className={clsx(
          'flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-md transition-colors',
          mode === 'preview'
            ? 'bg-white dark:bg-bible-bg-dark text-bible-accent shadow-sm'
            : 'text-bible-text-secondary dark:text-bible-text-secondary-dark'
        )}
      >
        <Eye size={11} />
        미리보기
      </button>
    </div>
  );
}
