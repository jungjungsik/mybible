'use client';

import { useEffect, useCallback } from 'react';
import { useSettings } from '@/hooks/useSettings';

export function useDarkMode() {
  const { settings, updateSetting } = useSettings();

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const toggleDarkMode = useCallback(async () => {
    await updateSetting('darkMode', !settings.darkMode);
  }, [settings.darkMode, updateSetting]);

  return { isDark: settings.darkMode, toggleDarkMode };
}
