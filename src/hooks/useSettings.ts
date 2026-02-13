'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';
import { setSetting, DEFAULT_SETTINGS } from '@/lib/db/settings';
import { AppSettings } from '@/types/bible';
import { useCallback } from 'react';

export function useSettings() {
  const settingsRecords = useLiveQuery(
    () => db.settings.toArray(),
    [],
    []
  );

  const settings: AppSettings = {
    currentVersion: (settingsRecords?.find(s => s.key === 'currentVersion')?.value as string) ?? DEFAULT_SETTINGS.currentVersion,
    fontSize: (settingsRecords?.find(s => s.key === 'fontSize')?.value as number) ?? DEFAULT_SETTINGS.fontSize,
    darkMode: (settingsRecords?.find(s => s.key === 'darkMode')?.value as boolean) ?? DEFAULT_SETTINGS.darkMode,
    speechRate: (settingsRecords?.find(s => s.key === 'speechRate')?.value as number) ?? DEFAULT_SETTINGS.speechRate,
    lastRead: (settingsRecords?.find(s => s.key === 'lastRead')?.value as AppSettings['lastRead']) ?? DEFAULT_SETTINGS.lastRead,
  };

  const isLoading = settingsRecords === undefined;

  const updateSetting = useCallback(async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    await setSetting(key, value);
  }, []);

  return { settings, updateSetting, isLoading };
}
