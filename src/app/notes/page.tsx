'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { NoteCard } from '@/components/notes/NoteCard';
import { BookmarkCard } from '@/components/notes/BookmarkCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSermonNotes, useAllVerseNotes } from '@/hooks/useNotes';
import { useAllBookmarks } from '@/hooks/useBookmarks';
import { removeBookmark } from '@/lib/db/bookmarks';
import { Plus, BookOpen, FileText, BookmarkIcon } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'sermon' | 'verse' | 'bookmark';

const TABS: { key: Tab; label: string; icon: typeof BookOpen }[] = [
  { key: 'sermon', label: '설교 노트', icon: BookOpen },
  { key: 'verse', label: '절 메모', icon: FileText },
  { key: 'bookmark', label: '북마크', icon: BookmarkIcon },
];

export default function NotesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('sermon');
  const [deleteBookmarkId, setDeleteBookmarkId] = useState<string | null>(null);

  const sermonNotes = useSermonNotes();
  const verseNotes = useAllVerseNotes();
  const bookmarks = useAllBookmarks();
  const handleSermonNoteClick = (noteId: string) => {
    router.push(`/notes/sermon/${noteId}`);
  };

  const handleVerseNoteClick = (book: string, chapter: number, verse?: number) => {
    if (verse) {
      router.push(`/read/${book}/${chapter}?verse=${verse}`);
    } else {
      router.push(`/read/${book}/${chapter}`);
    }
  };

  const handleBookmarkClick = (book: string, chapter: number, verse: number) => {
    router.push(`/read/${book}/${chapter}?verse=${verse}`);
  };

  const handleDeleteBookmark = async () => {
    if (deleteBookmarkId) {
      await removeBookmark(deleteBookmarkId);
      setDeleteBookmarkId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark">
      <Header title="노트" />

      {/* Tabs */}
      <div className="flex gap-1.5 p-3 bg-bible-bg dark:bg-bible-bg-dark">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-sans font-medium rounded-xl transition-all duration-200',
              activeTab === key
                ? 'bg-bible-accent text-white shadow-warm'
                : 'text-bible-text-secondary dark:text-bible-text-secondary-dark hover:bg-bible-surface dark:hover:bg-bible-surface-dark'
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {/* Sermon Notes Tab */}
        {activeTab === 'sermon' && (
          <div className="flex flex-col gap-3">
            {sermonNotes.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <BookOpen size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>설교 노트가 없습니다</p>
                <p className="text-xs mt-1">아래 버튼을 눌러 새 설교 노트를 작성하세요</p>
              </div>
            ) : (
              sermonNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleSermonNoteClick(note.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Verse Memos Tab */}
        {activeTab === 'verse' && (
          <div className="flex flex-col gap-3">
            {verseNotes.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <FileText size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>절 메모가 없습니다</p>
                <p className="text-xs mt-1">성경 읽기 화면에서 절을 선택하여 메모를 추가하세요</p>
              </div>
            ) : (
              verseNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleVerseNoteClick(note.book, note.chapter, note.verse)}
                />
              ))
            )}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmark' && (
          <div className="flex flex-col gap-3">
            {bookmarks.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <BookmarkIcon size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>북마크가 없습니다</p>
                <p className="text-xs mt-1">성경 읽기 화면에서 절을 선택하여 북마크를 추가하세요</p>
              </div>
            ) : (
              bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onClick={() =>
                    handleBookmarkClick(bookmark.book, bookmark.chapter, bookmark.verse)
                  }
                  onDelete={() => setDeleteBookmarkId(bookmark.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* FAB for new sermon note */}
      {activeTab === 'sermon' && (
        <button
          onClick={() => router.push('/notes/sermon/new')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-bible-accent text-white rounded-full shadow-warm-lg flex items-center justify-center hover:bg-bible-accent-hover active:scale-[0.95] transition-all z-30"
          aria-label="새 설교 노트"
        >
          <Plus size={24} />
        </button>
      )}

      <ConfirmDialog
        isOpen={deleteBookmarkId !== null}
        title="북마크 삭제"
        message="이 북마크를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        destructive
        onConfirm={handleDeleteBookmark}
        onCancel={() => setDeleteBookmarkId(null)}
      />
    </div>
  );
}
