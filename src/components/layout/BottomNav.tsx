'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Search, PenSquare, Settings } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/books', icon: BookOpen, label: '성경' },
  { href: '/search', icon: Search, label: '검색' },
  { href: '/notes', icon: PenSquare, label: '노트' },
  { href: '/settings', icon: Settings, label: '설정' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-50 border-t border-bible-border/60 dark:border-bible-border-dark/60 safe-area-bottom">
      <div className="max-w-3xl mx-auto flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')) ||
            (href === '/books' && pathname.startsWith('/read'));

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] transition-all duration-200',
                isActive
                  ? 'text-bible-accent dark:text-bible-accent-dark nav-pill-active'
                  : 'text-bible-text-secondary/60 dark:text-bible-text-secondary-dark/60 hover:text-bible-accent/70 dark:hover:text-bible-accent-dark/70'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="font-sans text-[10px] mt-1 tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
