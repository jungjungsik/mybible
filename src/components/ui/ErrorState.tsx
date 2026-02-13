'use client';

import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = '데이터를 불러오는 데 실패했습니다',
  onRetry
}: ErrorStateProps) {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <div className="card flex flex-col items-center justify-center py-16 px-4 text-center mx-auto max-w-md p-8">
      {isOffline ? (
        <WifiOff size={48} className="text-bible-accent mb-4" />
      ) : (
        <AlertTriangle size={48} className="text-bible-accent mb-4" />
      )}

      <p className="font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark mb-2">
        {isOffline ? '오프라인 상태입니다' : message}
      </p>

      {isOffline && (
        <p className="font-sans text-sm text-bible-text-secondary dark:text-bible-text-secondary-dark mb-4">
          인터넷 연결을 확인해주세요
        </p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw size={16} />
          다시 시도
        </button>
      )}
    </div>
  );
}
