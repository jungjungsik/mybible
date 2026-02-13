'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SermonNoteEditor } from '@/components/notes/SermonNoteEditor';
import { ErrorState } from '@/components/ui/ErrorState';
import { getNoteById } from '@/lib/db/notes';

interface SermonNotePageProps {
  params: { id: string };
}

export default function SermonNotePage({ params }: SermonNotePageProps) {
  const { id } = params;
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkNote = async () => {
      const note = await getNoteById(id);
      setExists(!!note);
    };
    checkNote();
  }, [id]);

  // Loading
  if (exists === null) {
    return (
      <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark font-sans">
        <Header title="설교 노트" showBack />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bible-accent" />
        </div>
      </div>
    );
  }

  // Not found
  if (!exists) {
    return (
      <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark font-sans">
        <Header title="설교 노트" showBack />
        <ErrorState message="노트를 찾을 수 없습니다" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark font-sans">
      <Header title="설교 노트" showBack />
      <div className="flex-1 font-serif">
        <SermonNoteEditor noteId={id} />
      </div>
    </div>
  );
}
