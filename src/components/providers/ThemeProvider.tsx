'use client';

import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Watch uiFontSize from IndexedDB
  const uiFontSizeRecord = useLiveQuery(
    () => db.settings.get('uiFontSize'),
    [],
    undefined
  );
  const uiFontSize = (uiFontSizeRecord?.value as number) ?? 14;

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('bible-dark-mode');
    if (stored === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Apply UI font size as CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--ui-font-size', `${uiFontSize}px`);
  }, [uiFontSize]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
