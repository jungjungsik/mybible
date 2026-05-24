'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { SermonNoteEditor } from '@/components/notes/SermonNoteEditor';
import { SERMON_TEMPLATES } from '@/lib/constants/sermonTemplates';
import { Sparkles } from 'lucide-react';
import clsx from 'clsx';

export default function NewSermonNotePage() {
  const [pickedTemplate, setPickedTemplate] = useState<string | null>(null);

  if (pickedTemplate === null) {
    return (
      <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark font-sans">
        <Header title="새 설교 노트" showBack />
        <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-bible-accent" />
            <h2 className="font-display text-base font-semibold text-bible-text dark:text-bible-text-dark">
              템플릿 선택
            </h2>
          </div>
          <p className="text-xs text-bible-text-secondary dark:text-bible-text-secondary-dark mb-4 px-1">
            템플릿을 선택하면 미리 구성된 마크다운 골격으로 시작합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERMON_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setPickedTemplate(t.id)}
                className={clsx(
                  'card p-4 text-left active:scale-[0.99] transition-transform',
                  'hover:shadow-warm-lg hover:border-bible-accent/40'
                )}
              >
                <h3 className="font-display text-base font-semibold text-bible-text dark:text-bible-text-dark mb-1">
                  {t.name}
                </h3>
                <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const template = SERMON_TEMPLATES.find((t) => t.id === pickedTemplate);

  return (
    <div className="min-h-screen flex flex-col bg-bible-bg dark:bg-bible-bg-dark font-sans">
      <Header title="새 설교 노트" showBack />
      <div className="flex-1 font-serif">
        <SermonNoteEditor initialContent={template?.content ?? ''} />
      </div>
    </div>
  );
}
