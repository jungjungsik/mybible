'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/db/index';

const MIN_DURATION_MS = 5000; // ignore sessions shorter than 5 seconds
const BACKUP_INTERVAL_MS = 30000; // save every 30 seconds as backup

function getDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useReadingTimer(book: string, chapter: number) {
  const startTimeRef = useRef<number>(Date.now());
  const accumulatedRef = useRef<number>(0);
  const visibleSinceRef = useRef<number>(Date.now());
  const savedRef = useRef<boolean>(false);

  useEffect(() => {
    // Reset on mount
    startTimeRef.current = Date.now();
    accumulatedRef.current = 0;
    visibleSinceRef.current = Date.now();
    savedRef.current = false;

    // Page Visibility API — pause/resume
    const handleVisibility = () => {
      const now = Date.now();
      if (document.hidden) {
        // Going hidden: accumulate elapsed visible time
        accumulatedRef.current += now - visibleSinceRef.current;
      } else {
        // Coming back: reset visible checkpoint
        visibleSinceRef.current = now;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // Backup save interval
    const backupTimer = setInterval(() => {
      if (savedRef.current) return;
      const now = Date.now();
      const totalMs = accumulatedRef.current + (document.hidden ? 0 : now - visibleSinceRef.current);
      if (totalMs >= MIN_DURATION_MS) {
        db.readingSessions.add({
          id: crypto.randomUUID(),
          date: getDateString(),
          book,
          chapter,
          durationMs: totalMs,
          startedAt: startTimeRef.current,
          endedAt: now,
        }).then(() => {
          // Reset for next interval
          startTimeRef.current = now;
          accumulatedRef.current = 0;
          visibleSinceRef.current = now;
        });
      }
    }, BACKUP_INTERVAL_MS);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(backupTimer);

      // Save remaining on unmount
      const now = Date.now();
      if (!document.hidden) {
        accumulatedRef.current += now - visibleSinceRef.current;
      }
      const durationMs = accumulatedRef.current;
      if (durationMs >= MIN_DURATION_MS && !savedRef.current) {
        // Fire-and-forget save on unmount
        db.readingSessions.add({
          id: crypto.randomUUID(),
          date: getDateString(),
          book,
          chapter,
          durationMs,
          startedAt: startTimeRef.current,
          endedAt: now,
        });
      }
    };
  }, [book, chapter]);
}
