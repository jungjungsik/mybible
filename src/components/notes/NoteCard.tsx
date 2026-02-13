'use client';

import { Note } from '@/types/bible';
import { formatReference } from '@/lib/utils/formatReference';
import { FileText, BookOpen } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

function formatKoreanDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${year}년 ${month}월 ${day}일`;
  } catch {
    return dateStr;
  }
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const reference =
    note.book && note.chapter
      ? formatReference(note.book, note.chapter, note.verse)
      : null;

  const preview =
    note.content.length > 100
      ? note.content.slice(0, 100) + '...'
      : note.content;

  const isSermon = note.type === 'sermon';

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5 shrink-0">
          {isSermon ? (
            <BookOpen size={18} className="text-bible-accent" />
          ) : (
            <FileText size={18} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Date */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {formatKoreanDate(note.date)}
          </div>

          {/* Title (sermon only) */}
          {isSermon && note.title && (
            <div className="text-base font-semibold mb-1 truncate">
              {note.title}
            </div>
          )}

          {/* Reference */}
          {reference && (
            <div className="text-xs text-bible-accent font-medium mb-1">
              {reference}
            </div>
          )}

          {/* Content preview */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
            {preview}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
