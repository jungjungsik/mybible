'use client';

import { Header } from '@/components/layout/Header';
import { SermonNoteEditor } from '@/components/notes/SermonNoteEditor';

export default function NewSermonNotePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark font-sans">
      <Header title="새 설교 노트" showBack />
      <div className="flex-1 font-serif">
        <SermonNoteEditor />
      </div>
    </div>
  );
}
