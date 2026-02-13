'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { getKoreanVersions, getEnglishVersions, getVersionById } from '@/lib/constants/versions';
import clsx from 'clsx';

interface VersionSelectorProps {
  currentVersion: string;
  onVersionChange: (versionId: string) => void;
}

export function VersionSelector({ currentVersion, onVersionChange }: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const koreanVersions = getKoreanVersions();
  const englishVersions = getEnglishVersions();
  const current = getVersionById(currentVersion);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl bg-bible-surface dark:bg-bible-surface-dark border border-bible-border dark:border-bible-border-dark shadow-warm hover:shadow-warm-lg transition-all"
      >
        <span className="font-sans font-medium text-bible-text dark:text-bible-text-dark">{current?.shortName ?? currentVersion}</span>
        <ChevronDown size={14} className={clsx('transition-transform text-bible-accent dark:text-bible-accent-dark', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl shadow-warm-xl z-50 overflow-hidden animate-scale-in">
          {/* Korean Versions */}
          <div className="px-3 py-2 font-sans text-[10px] text-bible-accent dark:text-bible-accent-dark uppercase tracking-widest font-medium">
            한국어
          </div>
          {koreanVersions.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onVersionChange(v.id);
                setIsOpen(false);
              }}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2.5 text-sm font-sans hover:bg-bible-accent/5 dark:hover:bg-bible-accent-dark/5 transition-colors',
                v.id === currentVersion && 'text-bible-accent dark:text-bible-accent-dark font-medium'
              )}
            >
              <span>{v.name}</span>
              {v.id === currentVersion && <Check size={16} className="text-bible-gold" />}
            </button>
          ))}

          {/* English Versions */}
          <div className="px-3 py-2 font-sans text-[10px] text-bible-accent dark:text-bible-accent-dark uppercase tracking-widest font-medium border-t border-bible-border/50 dark:border-bible-border-dark/50">
            English
          </div>
          {englishVersions.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onVersionChange(v.id);
                setIsOpen(false);
              }}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2.5 text-sm font-sans hover:bg-bible-accent/5 dark:hover:bg-bible-accent-dark/5 transition-colors',
                v.id === currentVersion && 'text-bible-accent dark:text-bible-accent-dark font-medium'
              )}
            >
              <span>{v.name}</span>
              {v.id === currentVersion && <Check size={16} className="text-bible-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
