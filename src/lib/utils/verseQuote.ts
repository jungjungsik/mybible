import { BibleVerse } from '@/types/bible';
import { formatReference } from '@/lib/utils/formatReference';

/**
 * Build a markdown-formatted scripture quote from one or more verses.
 *
 * Single verse:
 *   > 요한복음 3:16 — 하나님이 세상을 이처럼 사랑하사…
 *
 * Multiple verses (same chapter):
 *   > 요한복음 3:16-17
 *   > 하나님이 세상을 이처럼 사랑하사…
 *   > 17 하나님이 그 아들을 세상에 보내신 것은…
 */
export function formatVerseQuote(verses: BibleVerse[]): string {
  if (verses.length === 0) return '';

  const sorted = [...verses].sort((a, b) => a.verse - b.verse);
  const first = sorted[0];

  if (sorted.length === 1) {
    const ref = formatReference(first.book, first.chapter, first.verse);
    return `> **${ref}** — ${first.text}\n\n`;
  }

  const last = sorted[sorted.length - 1];
  const rangeLabel = `${formatReference(first.book, first.chapter, first.verse)}-${last.verse}`;
  const body = sorted
    .map((v, i) => (i === 0 ? `> ${v.text}` : `> **${v.verse}** ${v.text}`))
    .join('\n');
  return `> **${rangeLabel}**\n${body}\n\n`;
}
