'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { parseReference } from '@/lib/constants/books';
import { formatReference } from '@/lib/utils/formatReference';
import clsx from 'clsx';

interface QuickJumpProps {
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function QuickJump({ autoFocus = false, onNavigate, className }: QuickJumpProps) {
  const router = useRouter();
  const [input, setInput] = useState('');

  const parsed = input.trim() ? parseReference(input) : null;
  const isValid = parsed !== null;
  const resolvedLabel = parsed
    ? formatReference(parsed.book, parsed.chapter, parsed.verse)
    : null;

  const handleSubmit = useCallback(() => {
    if (!parsed) return;
    const url = parsed.verse
      ? `/read/${parsed.book}/${parsed.chapter}?verse=${parsed.verse}`
      : `/read/${parsed.book}/${parsed.chapter}`;
    router.push(url);
    onNavigate?.();
    setInput('');
  }, [parsed, router, onNavigate]);

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValid) {
              handleSubmit();
            }
          }}
          placeholder="구절 입력 (예: 요 3:16)"
          autoFocus={autoFocus}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-bible-accent/50 focus:border-bible-accent"
        />
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="p-2 rounded-lg bg-bible-accent text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          aria-label="이동"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Validation indicator */}
      {input.trim() && (
        <p
          className={clsx(
            'text-xs px-1',
            isValid
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-500 dark:text-red-400'
          )}
        >
          {isValid ? resolvedLabel : '알 수 없는 구절'}
        </p>
      )}
    </div>
  );
}
