'use client';

import { useEffect, useRef, ReactNode } from 'react';
import clsx from 'clsx';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={clsx(
          'glass absolute bottom-0 left-0 right-0',
          'rounded-t-3xl max-h-[80vh] overflow-y-auto',
          'shadow-warm-xl border-t border-bible-border/40 dark:border-bible-border-dark/40',
          'animate-slide-up safe-area-bottom'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1 bg-bible-accent/30 dark:bg-bible-accent-dark/30 rounded-full" />
        </div>

        {title && (
          <div className="px-5 pb-3 font-display text-lg font-semibold text-bible-text dark:text-bible-text-dark tracking-wide">
            {title}
          </div>
        )}

        <div className="px-5 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
