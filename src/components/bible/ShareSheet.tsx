'use client';

import { useRef, useState } from 'react';
import { Download, Loader2, Share2 } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ShareCard, ShareCardTheme, SHARE_THEMES } from '@/components/bible/ShareCard';
import { formatReference } from '@/lib/utils/formatReference';
import clsx from 'clsx';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  source: { book: string; chapter: number; verse: number; text: string } | null;
}

export function ShareSheet({ isOpen, onClose, source }: ShareSheetProps) {
  const [theme, setTheme] = useState<ShareCardTheme>('gold');
  const [busy, setBusy] = useState<null | 'save' | 'share'>(null);
  const [message, setMessage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!source) return null;

  const reference = formatReference(source.book, source.chapter, source.verse);
  const filename = `${source.book}_${source.chapter}_${source.verse}.png`;

  const capture = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    // Dynamic import keeps the share lib out of the initial bundle.
    const { toBlob } = await import('html-to-image');
    return toBlob(cardRef.current, {
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: undefined,
    });
  };

  const handleSave = async () => {
    setBusy('save');
    setMessage(null);
    try {
      const blob = await capture();
      if (!blob) throw new Error('capture failed');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setMessage('이미지를 저장했습니다.');
    } catch {
      setMessage('이미지 저장에 실패했습니다.');
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    setBusy('share');
    setMessage(null);
    try {
      const blob = await capture();
      if (!blob) throw new Error('capture failed');
      const file = new File([blob], filename, { type: 'image/png' });
      const data: ShareData = {
        files: [file],
        title: reference,
        text: `${reference} — ${source.text}`,
      };
      if (typeof navigator !== 'undefined' && navigator.canShare?.(data) && navigator.share) {
        await navigator.share(data);
      } else {
        // Fallback to download when the browser can't share files
        handleSave();
      }
    } catch (err) {
      // AbortError happens when user cancels the share dialog — silent.
      if (!(err instanceof Error) || err.name !== 'AbortError') {
        setMessage('공유에 실패했습니다.');
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="구절 공유">
      {/* Card preview — scaled down so 1080×1080 fits on screen */}
      <div className="flex items-center justify-center mb-4">
        <div
          style={{
            width: 320,
            height: 320,
            overflow: 'hidden',
            borderRadius: 24,
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.25)',
          }}
        >
          <div
            style={{
              transform: 'scale(0.2963)', // 320 / 1080
              transformOrigin: 'top left',
            }}
          >
            <ShareCard
              ref={cardRef}
              book={source.book}
              chapter={source.chapter}
              verse={source.verse}
              text={source.text}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Theme picker */}
      <div className="mb-4">
        <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark mb-2 px-1">
          배경
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SHARE_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={clsx(
                'flex flex-col items-center gap-1 flex-shrink-0',
                'rounded-xl p-1 border-2 transition-all',
                theme === t.id ? 'border-bible-accent' : 'border-transparent'
              )}
              aria-label={t.label}
            >
              <span
                className="w-10 h-10 rounded-lg"
                style={{ background: t.preview }}
              />
              <span className="text-[10px] font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className="text-xs font-sans text-bible-accent text-center mb-2">{message}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={busy !== null}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy === 'save' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          이미지 저장
        </button>
        <button
          onClick={handleShare}
          disabled={busy !== null}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy === 'share' ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
          공유
        </button>
      </div>
    </BottomSheet>
  );
}
