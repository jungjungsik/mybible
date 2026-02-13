'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Play, Pause, Square } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { VerseSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { VersionSelector } from '@/components/bible/VersionSelector';
import { ChapterView } from '@/components/bible/ChapterView';
import { ChapterNavigation } from '@/components/bible/ChapterNavigation';
import { VerseActionMenu } from '@/components/bible/VerseActionMenu';
import { VerseNoteEditor } from '@/components/notes/VerseNoteEditor';
import { useBible } from '@/hooks/useBible';
import { useHighlights, useToggleHighlight } from '@/hooks/useHighlights';
import { useChapterBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { useNotes } from '@/hooks/useNotes';
import { useSettings } from '@/hooks/useSettings';
import { useMarkChapterRead } from '@/hooks/useReadingProgress';
import { useTTS } from '@/hooks/useTTS';
import { getBookById } from '@/lib/constants/books';
import { getVersionById } from '@/lib/constants/versions';
import { BibleVerse, HighlightColor } from '@/types/bible';

interface ReadPageProps {
  params: { bookId: string; chapter: string };
}

export default function ReadPage({ params }: ReadPageProps) {
  const { bookId, chapter: chapterStr } = params;
  const chapterNum = parseInt(chapterStr, 10);
  const searchParams = useSearchParams();
  const verseParam = searchParams.get('verse');
  const scrollToVerse = verseParam ? parseInt(verseParam, 10) : undefined;

  const router = useRouter();
  const { settings, updateSetting, isLoading: settingsLoading } = useSettings();
  const { data, isLoading, error, refetch } = useBible(
    settingsLoading ? '' : settings.currentVersion,
    bookId,
    chapterNum
  );
  const highlights = useHighlights(bookId, chapterNum);
  const bookmarks = useChapterBookmarks(bookId, chapterNum);
  const notes = useNotes(bookId, chapterNum);
  const { toggleHighlight } = useToggleHighlight();
  const { toggleBookmark } = useToggleBookmark();
  const { markChapterRead } = useMarkChapterRead();

  // TTS
  const ttsLang = settings.currentVersion === 'krv' ? 'ko' : 'en';
  const { isPlaying: isTTSPlaying, currentVerseIndex: ttsVerseIndex, play: ttsPlay, pause: ttsPause, resume: ttsResume, stop: ttsStop, isSupported: ttsSupported } = useTTS({ lang: ttsLang, rate: settings.speechRate });

  const book = getBookById(bookId);

  // Verse action menu state
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showMemoEditor, setShowMemoEditor] = useState(false);

  // Save lastRead and mark chapter read when data loads
  useEffect(() => {
    if (data && book) {
      updateSetting('lastRead', { book: bookId, chapter: chapterNum });
      markChapterRead(bookId, chapterNum);
    }
  }, [data, book, bookId, chapterNum, updateSetting, markChapterRead]);

  // Stop TTS on unmount or chapter change
  useEffect(() => {
    return () => ttsStop();
  }, [bookId, chapterNum, ttsStop]);

  const handleVerseTap = useCallback((verse: BibleVerse) => {
    setSelectedVerse(verse);
    setShowActionMenu(true);
  }, []);

  const handleCloseActionMenu = useCallback(() => {
    setShowActionMenu(false);
    // Delay clearing selectedVerse so the sheet can animate out
    setTimeout(() => setSelectedVerse(null), 300);
  }, []);

  const handleHighlight = useCallback(
    (color: HighlightColor) => {
      if (!selectedVerse) return;
      toggleHighlight(
        selectedVerse.book,
        selectedVerse.chapter,
        selectedVerse.verse,
        color,
        settings.currentVersion
      );
    },
    [selectedVerse, toggleHighlight, settings.currentVersion]
  );

  const handleBookmark = useCallback(() => {
    if (!selectedVerse) return;
    toggleBookmark(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse);
  }, [selectedVerse, toggleBookmark]);

  const handleMemo = useCallback(() => {
    if (!selectedVerse) return;
    setShowActionMenu(false);
    setShowMemoEditor(true);
  }, [selectedVerse]);

  const handleCompare = useCallback(() => {
    if (!selectedVerse) return;
    router.push(`/compare?book=${selectedVerse.book}&chapter=${selectedVerse.chapter}&verse=${selectedVerse.verse}`);
  }, [selectedVerse, router]);

  const handleVersionChange = useCallback(
    (versionId: string) => {
      updateSetting('currentVersion', versionId);
    },
    [updateSetting]
  );

  // Find current highlight and bookmark status for the selected verse
  const currentHighlight = selectedVerse
    ? highlights.find((h) => h.verse === selectedVerse.verse)
    : undefined;
  const isSelectedBookmarked = selectedVerse
    ? bookmarks.some((b) => b.verse === selectedVerse.verse)
    : false;

  const headerTitle = book ? `${book.name} ${chapterNum}장` : `${bookId} ${chapterNum}`;

  return (
    <>
      <Header
        title={headerTitle}
        showBack
        rightActions={
          <div className="flex items-center gap-1">
            {ttsSupported && (
              <button
                onClick={() => {
                  if (isTTSPlaying) {
                    ttsPause();
                  } else if (ttsVerseIndex !== null) {
                    ttsResume();
                  } else if (data) {
                    ttsPlay(data.verses);
                  }
                }}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isTTSPlaying ? '일시정지' : '음성 듣기'}
              >
                {isTTSPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
            {ttsSupported && ttsVerseIndex !== null && (
              <button
                onClick={ttsStop}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="정지"
              >
                <Square size={14} fill="currentColor" />
              </button>
            )}
            <VersionSelector
              currentVersion={settings.currentVersion}
              onVersionChange={handleVersionChange}
            />
          </div>
        }
      />

      {/* TTS playing indicator */}
      {ttsVerseIndex !== null && data && (
        <div className="glass flex items-center justify-between mx-4 mt-2 px-4 py-2 rounded-lg text-sm font-sans border border-bible-border/30 dark:border-bible-border-dark/30">
          <span className="text-bible-accent font-medium">
            {isTTSPlaying ? '재생 중' : '일시정지'} — {getVersionById(settings.currentVersion)?.shortName ?? settings.currentVersion}
          </span>
          <span className="text-bible-accent/70">
            {data.verses[ttsVerseIndex]?.verse ?? ''}절 / {data.verses.length}절
          </span>
        </div>
      )}

      {/* Chapter content */}
      <main className="min-h-[60vh]">
        {isLoading && !data && <VerseSkeleton />}
        {error && !isLoading && <ErrorState message={error} onRetry={refetch} />}
        {!isLoading && data && (
          <ChapterView
            chapter={data}
            highlights={highlights}
            bookmarks={bookmarks}
            notes={notes}
            fontSize={settings.fontSize}
            onVerseTap={handleVerseTap}
            scrollToVerse={scrollToVerse}
            activeVerseIndex={ttsVerseIndex}
          />
        )}
      </main>

      {/* Chapter navigation */}
      {book && (
        <ChapterNavigation
          bookId={bookId}
          chapter={chapterNum}
          totalChapters={book.chapters}
        />
      )}

      {/* Verse action menu */}
      <VerseActionMenu
        verse={selectedVerse}
        isOpen={showActionMenu}
        onClose={handleCloseActionMenu}
        onHighlight={handleHighlight}
        onBookmark={handleBookmark}
        onMemo={handleMemo}
        onCompare={handleCompare}
        currentHighlight={currentHighlight}
        isBookmarked={isSelectedBookmarked}
      />

      {/* Verse note editor */}
      {selectedVerse && (
        <VerseNoteEditor
          isOpen={showMemoEditor}
          onClose={() => setShowMemoEditor(false)}
          book={selectedVerse.book}
          chapter={selectedVerse.chapter}
          verse={selectedVerse.verse}
          verseText={selectedVerse.text}
        />
      )}
    </>
  );
}
