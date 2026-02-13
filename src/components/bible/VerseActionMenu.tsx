'use client';

import { Copy, Bookmark, PenSquare, ArrowLeftRight } from 'lucide-react';
import { BibleVerse, Highlight, HighlightColor } from '@/types/bible';
import { HIGHLIGHT_COLORS } from '@/lib/constants/colors';
import { formatReference } from '@/lib/utils/formatReference';
import { BottomSheet } from '@/components/ui/BottomSheet';
import clsx from 'clsx';

interface VerseActionMenuProps {
  verse: BibleVerse | null;
  isOpen: boolean;
  onClose: () => void;
  onHighlight: (color: HighlightColor) => void;
  onBookmark: () => void;
  onMemo: () => void;
  onCompare: () => void;
  currentHighlight?: Highlight;
  isBookmarked: boolean;
}

export function VerseActionMenu({
  verse,
  isOpen,
  onClose,
  onHighlight,
  onBookmark,
  onMemo,
  onCompare,
  currentHighlight,
  isBookmarked,
}: VerseActionMenuProps) {
  if (!verse) return null;

  const reference = formatReference(verse.book, verse.chapter, verse.verse);
  const truncatedText =
    verse.text.length > 100 ? verse.text.slice(0, 100) + '...' : verse.text;

  async function handleCopy() {
    const copyText = `${reference} - ${verse!.text}`;
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      // Fallback: do nothing silently
    }
    onClose();
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* Selected verse preview */}
      <div className="card mb-4 rounded-xl p-3">
        <p className="font-sans text-bible-accent dark:text-bible-accent-dark font-semibold text-xs mb-1">{reference}</p>
        <p className="font-serif text-sm text-bible-text/80 dark:text-bible-text-dark/80 leading-relaxed italic">
          {truncatedText}
        </p>
      </div>

      <div className="space-y-1">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-sans hover:bg-bible-accent/5 dark:hover:bg-bible-accent-dark/5 transition-colors"
        >
          <Copy size={20} className="text-bible-accent dark:text-bible-accent-dark" />
          <span className="text-sm">복사</span>
        </button>

        {/* Highlight colors */}
        <div className="flex items-center gap-3 px-3 py-3">
          <span className="text-sm font-sans text-bible-text/60 dark:text-bible-text-dark/60 mr-1">형광펜</span>
          <div className="flex items-center gap-2">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => onHighlight(color.id)}
                className={clsx(
                  'w-7 h-7 rounded-full border-2 transition-all',
                  currentHighlight?.color === color.id
                    ? 'border-bible-gold scale-110 ring-2 ring-offset-2 ring-bible-gold'
                    : 'border-transparent'
                )}
                style={{ backgroundColor: color.lightHex }}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => {
            onBookmark();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-sans hover:bg-bible-accent/5 dark:hover:bg-bible-accent-dark/5 transition-colors"
        >
          <Bookmark
            size={20}
            className={clsx(isBookmarked ? 'text-bible-gold' : 'text-bible-accent dark:text-bible-accent-dark')}
            fill={isBookmarked ? 'currentColor' : 'none'}
          />
          <span className="text-sm">
            {isBookmarked ? '북마크 제거' : '북마크 추가'}
          </span>
        </button>

        {/* Memo */}
        <button
          onClick={() => {
            onMemo();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-sans hover:bg-bible-accent/5 dark:hover:bg-bible-accent-dark/5 transition-colors"
        >
          <PenSquare size={20} className="text-bible-accent dark:text-bible-accent-dark" />
          <span className="text-sm">메모 추가</span>
        </button>

        {/* Compare */}
        <button
          onClick={() => {
            onCompare();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-sans hover:bg-bible-accent/5 dark:hover:bg-bible-accent-dark/5 transition-colors"
        >
          <ArrowLeftRight size={20} className="text-bible-accent dark:text-bible-accent-dark" />
          <span className="text-sm">다른 버전으로 보기</span>
        </button>
      </div>
    </BottomSheet>
  );
}
