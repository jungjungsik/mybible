import { db } from './index';
import { AppSettings } from '@/types/bible';

const DEFAULT_SETTINGS: AppSettings = {
  currentVersion: 'krv',
  fontSize: 18,
  darkMode: false,
  speechRate: 1.0,
  uiFontSize: 14,
  lastRead: null,
};

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const record = await db.settings.get(key);
  if (record === undefined) return defaultValue;
  return record.value as T;
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  await db.settings.put({ key, value });
}

export async function getAllSettings(): Promise<AppSettings> {
  const currentVersion = await getSetting('currentVersion', DEFAULT_SETTINGS.currentVersion);
  const fontSize = await getSetting('fontSize', DEFAULT_SETTINGS.fontSize);
  const darkMode = await getSetting('darkMode', DEFAULT_SETTINGS.darkMode);
  const speechRate = await getSetting('speechRate', DEFAULT_SETTINGS.speechRate);
  const uiFontSize = await getSetting('uiFontSize', DEFAULT_SETTINGS.uiFontSize);
  const lastRead = await getSetting('lastRead', DEFAULT_SETTINGS.lastRead);
  return { currentVersion, fontSize, darkMode, speechRate, uiFontSize, lastRead };
}

export { DEFAULT_SETTINGS };
