'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { parseReference } from '@/lib/constants/books';
import { formatReference } from '@/lib/utils/formatReference';
import { useBible } from '@/hooks/useBible';
import { useAddNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes';
import { getNoteById } from '@/lib/db/notes';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Trash2, BookOpen } from 'lucide-react';
import type { Note } from '@/types/bible';

interface SermonNoteEditorProps {
  noteId?: string;
}

export function SermonNoteEditor({ noteId }: SermonNoteEditorProps) {
  const router = useRouter();
  const { addNote } = useAddNote();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [referenceInput, setReferenceInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(!noteId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(noteId ?? null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

  // Parse the scripture reference
  const parsed = referenceInput.trim() ? parseReference(referenceInput) : null;
  const resolvedLabel = parsed
    ? formatReference(parsed.book, parsed.chapter, parsed.verse)
    : null;

  // Fetch Bible text when valid reference is entered
  const { data: chapterData } = useBible(
    'krv',
    parsed?.book ?? '',
    parsed?.chapter ?? 0
  );

  // Get the relevant verses
  const scriptureVerses = (() => {
    if (!chapterData || !parsed) return [];
    if (parsed.verse) {
      return chapterData.verses.filter((v) => v.verse === parsed.verse);
    }
    return chapterData.verses;
  })();

  // Load existing note if editing
  useEffect(() => {
    if (!noteId || hasInitialized.current) return;

    const loadNote = async () => {
      const note = await getNoteById(noteId);
      if (note) {
        setTitle(note.title ?? '');
        setContent(note.content);
        setDate(note.date);
        setTagsInput(note.tags?.join(', ') ?? '');
        // Reconstruct reference input from stored book/chapter/verse
        if (note.book && note.chapter) {
          const ref = formatReference(note.book, note.chapter, note.verse);
          setReferenceInput(ref);
        }
        hasInitialized.current = true;
      }
      setIsLoaded(true);
    };

    loadNote();
  }, [noteId]);

  // Build the note data for saving
  const buildNoteData = useCallback((): Omit<Note, 'id' | 'createdAt' | 'updatedAt'> => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    return {
      type: 'sermon',
      book: parsed?.book ?? '',
      chapter: parsed?.chapter ?? 0,
      verse: parsed?.verse,
      title: title.trim() || undefined,
      content,
      date,
      tags: tags.length > 0 ? tags : undefined,
    };
  }, [title, content, date, tagsInput, parsed]);

  // Save the note
  const handleSave = useCallback(async () => {
    // Don't save if completely empty
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    try {
      const noteData = buildNoteData();
      if (savedNoteId) {
        await updateNote(savedNoteId, noteData);
      } else {
        const id = await addNote(noteData);
        if (id) {
          setSavedNoteId(id);
          // Replace URL so we don't create a new note if user refreshes
          router.replace(`/notes/sermon/${id}`);
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [buildNoteData, savedNoteId, addNote, updateNote, router, title, content]);

  // Auto-save with 2s debounce
  useEffect(() => {
    if (!isLoaded) return;
    if (!title.trim() && !content.trim()) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, date, referenceInput, tagsInput, isLoaded]);

  const handleDelete = async () => {
    if (savedNoteId) {
      await deleteNote(savedNoteId);
    }
    setShowDeleteConfirm(false);
    router.push('/notes');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bible-accent" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        {/* Date and delete */}
        <div className="flex items-center justify-between">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="font-sans px-3 py-2 text-sm text-bible-text-secondary dark:text-bible-text-secondary-dark border border-bible-border dark:border-bible-border-dark rounded-lg bg-white dark:bg-bible-surface-dark focus:outline-none focus:ring-2 focus:ring-bible-accent/50"
          />
          {savedNoteId && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-500 hover:text-red-600 transition-colors"
              aria-label="삭제"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="설교 제목"
          className="w-full font-display text-xl px-4 py-3 border-b-2 border-bible-border dark:border-bible-border-dark bg-transparent focus:outline-none focus:border-bible-accent"
        />

        {/* Scripture Reference Input */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-bible-accent shrink-0" />
            <input
              type="text"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              placeholder="본문 입력 (예: 요 3:16)"
              className="font-sans flex-1 px-3 py-2 text-sm border border-bible-border dark:border-bible-border-dark rounded-lg bg-white dark:bg-bible-surface-dark focus:outline-none focus:ring-2 focus:ring-bible-accent/50"
            />
          </div>
          {referenceInput.trim() && (
            <p
              className={`font-sans text-xs px-1 ml-6 ${
                parsed
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              {parsed ? resolvedLabel : '알 수 없는 구절'}
            </p>
          )}
        </div>

        {/* Scripture text display */}
        {scriptureVerses.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
            <div className="text-xs font-semibold text-bible-accent mb-2">
              {resolvedLabel}
            </div>
            <div className="space-y-1">
              {scriptureVerses.map((v) => (
                <p
                  key={v.verse}
                  className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                >
                  <span className="text-bible-verse-num dark:text-bible-verse-num-dark text-xs mr-1">
                    {v.verse}
                  </span>
                  {v.text}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Notes textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="설교 노트를 입력하세요..."
          rows={12}
          className="font-serif w-full p-4 text-base leading-relaxed border border-bible-border dark:border-bible-border-dark rounded-xl bg-white dark:bg-bible-surface-dark focus:outline-none focus:ring-2 focus:ring-bible-accent/50 focus:border-bible-accent resize-none"
        />

        {/* Tags */}
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="태그 (쉼표로 구분: 사랑, 은혜, 믿음)"
          className="font-sans w-full px-3 py-2 text-sm border border-bible-border dark:border-bible-border-dark rounded-lg bg-white dark:bg-bible-surface-dark focus:outline-none focus:ring-2 focus:ring-bible-accent/50"
        />

        {/* Saving indicator */}
        {isSaving && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            자동 저장 중...
          </p>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="설교 노트 삭제"
        message="이 설교 노트를 삭제하시겠습니까? 삭제된 노트는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
