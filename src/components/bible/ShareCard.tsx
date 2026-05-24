'use client';

import { forwardRef } from 'react';
import { formatReference } from '@/lib/utils/formatReference';

export type ShareCardTheme = 'gold' | 'sunset' | 'ocean' | 'forest' | 'parchment' | 'midnight';

export const SHARE_THEMES: { id: ShareCardTheme; label: string; preview: string }[] = [
  { id: 'gold',      label: '골드',      preview: 'linear-gradient(135deg, #fde68a, #d97706)' },
  { id: 'sunset',    label: '선셋',      preview: 'linear-gradient(135deg, #fdba74, #e11d48)' },
  { id: 'ocean',     label: '오션',      preview: 'linear-gradient(135deg, #93c5fd, #3730a3)' },
  { id: 'forest',    label: '포레스트',  preview: 'linear-gradient(135deg, #a7f3d0, #115e59)' },
  { id: 'parchment', label: '양피지',    preview: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  { id: 'midnight',  label: '미드나잇',  preview: 'linear-gradient(135deg, #1e293b, #0f172a)' },
];

interface ShareCardProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  theme: ShareCardTheme;
  /** Capture-only rendering at full resolution (1080px). When false, scales for preview. */
  capture?: boolean;
}

const THEME_STYLES: Record<
  ShareCardTheme,
  { background: string; textColor: string; refColor: string; subColor: string }
> = {
  gold: {
    background: 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)',
    textColor: '#3f1f0e',
    refColor: '#5b2c0a',
    subColor: 'rgba(63, 31, 14, 0.6)',
  },
  sunset: {
    background: 'linear-gradient(135deg, #fdba74 0%, #e11d48 100%)',
    textColor: '#ffffff',
    refColor: '#ffe9d6',
    subColor: 'rgba(255, 255, 255, 0.7)',
  },
  ocean: {
    background: 'linear-gradient(135deg, #93c5fd 0%, #3730a3 100%)',
    textColor: '#ffffff',
    refColor: '#e0e7ff',
    subColor: 'rgba(255, 255, 255, 0.7)',
  },
  forest: {
    background: 'linear-gradient(135deg, #a7f3d0 0%, #115e59 100%)',
    textColor: '#ffffff',
    refColor: '#d1fae5',
    subColor: 'rgba(255, 255, 255, 0.75)',
  },
  parchment: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    textColor: '#3f1f0e',
    refColor: '#7c2d12',
    subColor: 'rgba(63, 31, 14, 0.55)',
  },
  midnight: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    textColor: '#f8fafc',
    refColor: '#fbbf24',
    subColor: 'rgba(248, 250, 252, 0.55)',
  },
};

/**
 * 1080×1080 share card. Always rendered at full 1080px resolution so the
 * capture (html-to-image with pixelRatio=1) yields a high-quality PNG. The
 * parent controls visual scale via CSS transform when needed.
 */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { book, chapter, verse, text, theme },
  ref
) {
  const styles = THEME_STYLES[theme];
  const reference = formatReference(book, chapter, verse);

  // Adapt font size based on text length so long verses still fit
  const len = text.length;
  const fontSize =
    len < 60 ? 64 : len < 120 ? 52 : len < 200 ? 42 : len < 300 ? 34 : 28;

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1080,
        background: styles.background,
        color: styles.textColor,
        padding: 96,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '"Noto Serif KR", "Playfair Display", serif',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Top ornament */}
      <div
        style={{
          fontSize: 24,
          letterSpacing: 8,
          textAlign: 'center',
          color: styles.subColor,
          fontWeight: 600,
        }}
      >
        ✦
      </div>

      {/* Verse text — centered, balanced */}
      <div
        style={{
          fontSize,
          lineHeight: 1.5,
          fontStyle: 'italic',
          textAlign: 'center',
          color: styles.textColor,
          padding: '0 24px',
        }}
      >
        &ldquo;{text}&rdquo;
      </div>

      {/* Bottom: reference + watermark */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: styles.refColor,
            letterSpacing: 1,
            fontFamily: '"Playfair Display", "Noto Serif KR", serif',
          }}
        >
          {reference}
        </div>
        <div
          style={{
            fontSize: 22,
            color: styles.subColor,
            fontWeight: 500,
            letterSpacing: 2,
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}
        >
          iLoveBible
        </div>
      </div>
    </div>
  );
});
