'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, RefreshCw, Shuffle } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { formatReference } from '@/lib/utils/formatReference';
import clsx from 'clsx';

interface MemorizeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  source: { book: string; chapter: number; verse: number; text: string } | null;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY: Record<Difficulty, { label: string; ratio: number }> = {
  easy: { label: '쉬움', ratio: 0.3 },
  medium: { label: '중간', ratio: 0.6 },
  hard: { label: '어려움', ratio: 1.0 },
};

interface Token {
  text: string;
  index: number;
  isWord: boolean;
}

// Tiny deterministic hash so the "shuffle" stays stable until user reshuffles.
function pseudoHash(n: number, salt: number): number {
  return ((n + 1) * 9301 + salt * 49297) % 233280;
}

export function MemorizeSheet({ isOpen, onClose, source }: MemorizeSheetProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [seed, setSeed] = useState(0);

  const text = source?.text ?? '';

  const tokens = useMemo<Token[]>(() => {
    return text.split(/(\s+)/).map((t, i) => ({
      text: t,
      index: i,
      // Hide actual word tokens that are 2+ chars (skip single-char particles and whitespace)
      isWord: !/^\s*$/.test(t) && t.length > 1,
    }));
  }, [text]);

  const hideableIndexes = useMemo(
    () => tokens.filter((t) => t.isWord).map((t) => t.index),
    [tokens]
  );

  const hiddenIndexes = useMemo(() => {
    const ratio = DIFFICULTY[difficulty].ratio;
    if (ratio >= 1) return new Set(hideableIndexes);

    // Deterministic pseudo-shuffle by hashing each index with the seed
    const shuffled = [...hideableIndexes].sort(
      (a, b) => pseudoHash(a, seed) - pseudoHash(b, seed)
    );
    const count = Math.max(1, Math.ceil(hideableIndexes.length * ratio));
    return new Set(shuffled.slice(0, count));
  }, [hideableIndexes, difficulty, seed]);

  // Reset reveal state when sheet opens, source changes, difficulty changes, or reshuffled
  useEffect(() => {
    setRevealed(new Set());
  }, [isOpen, source?.book, source?.chapter, source?.verse, difficulty, seed]);

  if (!source) return null;

  const reference = formatReference(source.book, source.chapter, source.verse);
  const remaining = hiddenIndexes.size - revealed.size;

  const handleRevealAll = () => setRevealed(new Set(hiddenIndexes));
  const handleReset = () => setRevealed(new Set());
  const handleReshuffle = () => setSeed((s) => s + 1);

  const handleWordClick = (index: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="암송 연습">
      {/* Reference */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-display text-bible-accent font-semibold">
          {reference}
        </p>
        <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
          가려진 단어 클릭 → 공개
        </p>
      </div>

      {/* Verse with hidden words */}
      <div className="card p-4 mb-4 rounded-xl">
        <p className="font-serif text-base leading-loose text-bible-text dark:text-bible-text-dark">
          {tokens.map((token) => {
            if (!hiddenIndexes.has(token.index)) {
              return <span key={token.index}>{token.text}</span>;
            }
            const isShown = revealed.has(token.index);
            return (
              <button
                key={token.index}
                onClick={() => handleWordClick(token.index)}
                className={clsx(
                  'inline-block align-baseline px-1 mx-px rounded transition-all',
                  isShown
                    ? 'bg-bible-accent/15 text-bible-text dark:text-bible-text-dark'
                    : 'bg-bible-accent/30 text-transparent hover:bg-bible-accent/45 active:scale-95 cursor-pointer select-none'
                )}
                style={{
                  // Match underlying word width to prevent layout shift on reveal
                  minWidth: `${token.text.length * 0.7}em`,
                }}
                aria-label={isShown ? token.text : '가려진 단어'}
              >
                {isShown ? token.text : ' '.repeat(token.text.length)}
              </button>
            );
          })}
        </p>
      </div>

      {/* Difficulty picker */}
      <div className="flex gap-2 mb-3">
        {(Object.keys(DIFFICULTY) as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={clsx(
              'flex-1 py-2 text-sm font-sans font-medium rounded-lg transition-colors',
              difficulty === d
                ? 'bg-bible-accent text-white shadow-warm'
                : 'bg-bible-surface dark:bg-bible-surface-dark text-bible-text-secondary dark:text-bible-text-secondary-dark hover:text-bible-text dark:hover:text-bible-text-dark'
            )}
          >
            {DIFFICULTY[d].label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark mb-3 px-1">
        <span>
          {hiddenIndexes.size > 0
            ? `${revealed.size}/${hiddenIndexes.size}개 공개 · ${remaining}개 남음`
            : '가릴 단어가 없습니다'}
        </span>
        <button
          onClick={handleReshuffle}
          className="flex items-center gap-1 text-bible-accent hover:opacity-80"
        >
          <Shuffle size={12} />
          섞기
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          리셋
        </button>
        <button
          onClick={handleRevealAll}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Eye size={14} />
          전체 공개
        </button>
      </div>
    </BottomSheet>
  );
}
