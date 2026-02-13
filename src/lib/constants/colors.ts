import { HighlightColor } from '@/types/bible';

export interface HighlightColorConfig {
  id: HighlightColor;
  name: string;
  light: string;     // CSS bg class for light mode
  dark: string;      // CSS bg class for dark mode
  lightHex: string;
  darkHex: string;
}

export const HIGHLIGHT_COLORS: HighlightColorConfig[] = [
  { id: 'yellow', name: '노랑', light: 'bg-bible-highlight-yellow', dark: 'dark:bg-bible-highlight-yellow-dark', lightHex: '#FFF9C4', darkHex: '#3D3800' },
  { id: 'green',  name: '초록', light: 'bg-bible-highlight-green',  dark: 'dark:bg-bible-highlight-green-dark',  lightHex: '#C8E6C9', darkHex: '#1B3D1C' },
  { id: 'blue',   name: '파랑', light: 'bg-bible-highlight-blue',   dark: 'dark:bg-bible-highlight-blue-dark',   lightHex: '#BBDEFB', darkHex: '#0D2B4A' },
  { id: 'pink',   name: '분홍', light: 'bg-bible-highlight-pink',   dark: 'dark:bg-bible-highlight-pink-dark',   lightHex: '#F8BBD0', darkHex: '#4A0D2B' },
  { id: 'purple', name: '보라', light: 'bg-bible-highlight-purple', dark: 'dark:bg-bible-highlight-purple-dark', lightHex: '#E1BEE7', darkHex: '#2D0D3D' },
];

export function getHighlightColorConfig(color: HighlightColor): HighlightColorConfig | undefined {
  return HIGHLIGHT_COLORS.find(c => c.id === color);
}

export function getHighlightBgClass(color: HighlightColor): string {
  const config = getHighlightColorConfig(color);
  if (!config) return '';
  return `${config.light} ${config.dark}`;
}
