'use client';

import { useCallback, useRef } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum horizontal distance in px to count as a swipe. Default 80. */
  threshold?: number;
  /** Maximum vertical-to-horizontal ratio. Higher = more lenient. Default 0.6. */
  maxVerticalRatio?: number;
  /** Maximum time in ms for a swipe gesture. Default 500. */
  maxDurationMs?: number;
  /** Disable when false (e.g. modal open). Default true. */
  enabled?: boolean;
}

/**
 * Lightweight touch-based horizontal swipe detector.
 * Returns React handlers to spread onto a container element.
 *
 * Designed for chapter navigation: ignores vertical scrolls, slow drags,
 * and short flicks. Does not call preventDefault, so page scroll stays
 * fluid.
 */
export function useSwipeNav({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  maxVerticalRatio = 0.6,
  maxDurationMs = 500,
  enabled = true,
}: SwipeOptions) {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      if (!touch) return;
      start.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
    },
    [enabled]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !start.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - start.current.x;
      const dy = touch.clientY - start.current.y;
      const dt = Date.now() - start.current.t;
      start.current = null;

      if (dt > maxDurationMs) return;
      if (Math.abs(dx) < threshold) return;
      if (Math.abs(dy) > Math.abs(dx) * maxVerticalRatio) return;

      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
    [enabled, onSwipeLeft, onSwipeRight, threshold, maxVerticalRatio, maxDurationMs]
  );

  const onTouchCancel = useCallback(() => {
    start.current = null;
  }, []);

  return { onTouchStart, onTouchEnd, onTouchCancel };
}
