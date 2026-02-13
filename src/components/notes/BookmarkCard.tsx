'use client';

import { Bookmark } from '@/types/bible';
import { formatReference } from '@/lib/utils/formatReference';
import { BookmarkIcon, X } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onClick: () => void;
  onDelete: () => void;
}

function formatKoreanDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function BookmarkCard({ bookmark, onClick, onDelete }: BookmarkCardProps) {
  const reference = formatReference(bookmark.book, bookmark.chapter, bookmark.verse);

  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Clickable area */}
      <button
        onClick={onClick}
        className="flex-1 text-left flex items-center gap-3 min-w-0"
      >
        <BookmarkIcon size={18} className="text-bible-accent shrink-0 fill-bible-accent" />
        <div className="min-w-0">
          <div className="text-base font-medium truncate">{reference}</div>
          {bookmark.label && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {bookmark.label}
            </div>
          )}
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formatKoreanDate(bookmark.createdAt)}
          </div>
        </div>
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
        aria-label="삭제"
      >
        <X size={18} />
      </button>
    </div>
  );
}
