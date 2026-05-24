import { describe, expect, it } from 'vitest';
import { formatVerseQuote } from './verseQuote';

describe('formatVerseQuote', () => {
  it('returns empty string for empty input', () => {
    expect(formatVerseQuote([])).toBe('');
  });

  it('formats a single verse as a blockquote line with reference', () => {
    const out = formatVerseQuote([
      { book: 'JHN', chapter: 3, verse: 16, text: '하나님이 세상을 이처럼 사랑하사', version: 'krv' },
    ]);
    expect(out).toContain('요한복음 3:16');
    expect(out).toContain('하나님이 세상을 이처럼 사랑하사');
    expect(out.startsWith('> ')).toBe(true);
    expect(out.endsWith('\n\n')).toBe(true);
  });

  it('formats multiple verses with range label and per-verse numbers', () => {
    const out = formatVerseQuote([
      { book: 'JHN', chapter: 3, verse: 16, text: '첫 번째 절', version: 'krv' },
      { book: 'JHN', chapter: 3, verse: 17, text: '두 번째 절', version: 'krv' },
      { book: 'JHN', chapter: 3, verse: 18, text: '세 번째 절', version: 'krv' },
    ]);
    expect(out).toContain('요한복음 3:16-18');
    expect(out).toContain('첫 번째 절');
    expect(out).toContain('두 번째 절');
    expect(out).toContain('세 번째 절');
    expect(out).toContain('**17**');
    expect(out).toContain('**18**');
  });

  it('sorts verses by verse number', () => {
    const out = formatVerseQuote([
      { book: 'JHN', chapter: 3, verse: 18, text: 'C', version: 'krv' },
      { book: 'JHN', chapter: 3, verse: 16, text: 'A', version: 'krv' },
      { book: 'JHN', chapter: 3, verse: 17, text: 'B', version: 'krv' },
    ]);
    expect(out.indexOf('A')).toBeLessThan(out.indexOf('B'));
    expect(out.indexOf('B')).toBeLessThan(out.indexOf('C'));
  });
});
