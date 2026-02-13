'use client';

import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read dark mode from localStorage for initial render (before IndexedDB loads)
    const stored = localStorage.getItem('bible-dark-mode');
    if (stored === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
