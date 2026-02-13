'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightActions?: ReactNode;
}

export function Header({ title, showBack = false, rightActions }: HeaderProps) {
  const router = useRouter();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="glass sticky top-0 z-40 h-14 flex items-center justify-between px-4 border-b border-bible-border/60 dark:border-bible-border-dark/60">
      <div className="flex items-center min-w-[40px]">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 touch-target rounded-xl text-bible-text dark:text-bible-text-dark hover:bg-bible-accent/10 transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>
        )}
      </div>

      <h1 className="font-display text-base font-semibold truncate mx-2 text-center flex-1 text-bible-text dark:text-bible-text-dark tracking-wide">
        {title}
      </h1>

      <div className="flex items-center gap-1 min-w-[40px] justify-end">
        {rightActions}
        <button
          onClick={toggleDarkMode}
          className="p-2 touch-target rounded-xl text-bible-text-secondary dark:text-bible-text-secondary-dark hover:bg-bible-accent/10 hover:text-bible-accent dark:hover:text-bible-accent-dark transition-colors"
          aria-label={isDark ? '라이트 모드' : '다크 모드'}
        >
          {isDark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
        </button>
      </div>
    </header>
  );
}
