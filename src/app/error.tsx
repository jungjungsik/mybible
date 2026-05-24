'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[app/error]', error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-5xl mb-4" aria-hidden>
        🙏
      </div>
      <h2 className="font-display text-2xl font-semibold text-bible-text dark:text-bible-text-dark mb-2">
        예기치 못한 오류가 발생했어요
      </h2>
      <p className="font-sans text-sm text-bible-text/70 dark:text-bible-text-dark/70 mb-6 max-w-sm">
        잠시 후 다시 시도하거나 홈으로 돌아가세요.
      </p>
      {process.env.NODE_ENV !== 'production' && (
        <pre className="font-mono text-xs text-left bg-bible-surface dark:bg-bible-surface-dark p-3 rounded mb-6 max-w-md overflow-auto">
          {error.message}
        </pre>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="btn-primary px-5 py-2 text-sm"
        >
          다시 시도
        </button>
        <a href="/" className="btn-secondary px-5 py-2 text-sm">
          홈으로
        </a>
      </div>
    </div>
  );
}
