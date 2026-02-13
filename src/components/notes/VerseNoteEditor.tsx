'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatReference } from '@/lib/utils/formatReference';
import { useVerseNotes, useAddNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes';

interface VerseNoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export function VerseNoteEditor({
  isOpen,
  onClose,
  book,
  chapter,
  verse,
  verseText,
}: VerseNoteEditorProps) {
  const existingNotes = useVerseNotes(book, chapter, verse);
  const existingNote = existingNotes.length > 0 ? existingNotes[0] : null;

  const { addNote } = useAddNote();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();

  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load existing note content when the editor opens
  useEffect(() => {
    if (isOpen && existingNote) {
      setContent(existingNote.content);
      setNoteId(existingNote.id);
    } else if (isOpen && !existingNote) {
      setContent('');
      setNoteId(null);
    }
  }, [isOpen, existingNote]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Auto-save with 2s debounce
  useEffect(() => {
    if (!isOpen || content.trim() === '') return;

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
  }, [content]);

  const handleSave = useCallback(async () => {
    if (content.trim() === '') return;
    setIsSaving(true);
    try {
      if (noteId) {
        await updateNote(noteId, { content });
      } else {
        const id = await addNote({
          type: 'verse',
          book,
          chapter,
          verse,
          content,
          date: new Date().toISOString().split('T')[0],
        });
        if (id) setNoteId(id);
      }
    } finally {
      setIsSaving(false);
    }
  }, [content, noteId, book, chapter, verse, addNote, updateNote]);

  const handleManualSave = async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    await handleSave();
    onClose();
  };

  const handleDelete = async () => {
    if (noteId) {
      await deleteNote(noteId);
    }
    setContent('');
    setNoteId(null);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    // Save if there's unsaved content
    if (content.trim() !== '') {
      handleSave();
    }
    onClose();
  };

  const reference = formatReference(book, chapter, verse);

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="메모">
        {/* Verse reference and text */}
        <div className="mb-4 p-3 bg-bible-surface/50 dark:bg-bible-surface-dark/50 rounded-lg">
          <div className="font-display text-sm font-semibold text-bible-accent mb-1">
            {reference}
          </div>
          <p className="font-serif text-sm italic text-bible-text dark:text-bible-text-dark leading-relaxed">
            {verseText}
          </p>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메모를 입력하세요..."
          rows={5}
          className="w-full p-3 text-base border border-bible-border dark:border-bible-border-dark rounded-xl bg-white dark:bg-bible-surface-dark focus:outline-none focus:ring-2 focus:ring-bible-accent/50 focus:border-bible-accent resize-none"
        />

        {/* Saving indicator */}
        {isSaving && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            저장 중...
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <div>
            {noteId && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="font-sans text-sm text-red-500 hover:text-red-600 font-medium"
              >
                삭제
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="btn-secondary"
            >
              취소
            </button>
            <button
              onClick={handleManualSave}
              className="btn-primary"
            >
              저장
            </button>
          </div>
        </div>
      </BottomSheet>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="메모 삭제"
        message="이 메모를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
