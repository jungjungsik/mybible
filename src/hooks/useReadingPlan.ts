'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/index';
import { setSetting } from '@/lib/db/settings';
import { ActivePlanState, ReadingPlanRef } from '@/types/bible';
import { getReadingPlan, getCurrentDay } from '@/lib/constants/readingPlans';

const ACTIVE_PLAN_KEY = 'activePlan';

/** Today as YYYY-MM-DD in local time. */
function todayISODate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns the currently active reading plan state (or null), with helpers
 * to start/stop a plan.
 */
export function useActivePlan() {
  const record = useLiveQuery(
    () => db.settings.get(ACTIVE_PLAN_KEY),
    [],
    undefined
  );

  const isLoading = record === undefined;
  const active: ActivePlanState | null =
    (record?.value as ActivePlanState | undefined) ?? null;

  const startPlan = useCallback(async (planId: string) => {
    const state: ActivePlanState = { planId, startDate: todayISODate() };
    await setSetting(ACTIVE_PLAN_KEY, state);
  }, []);

  const stopPlan = useCallback(async () => {
    await db.settings.delete(ACTIVE_PLAN_KEY);
  }, []);

  return { active, isLoading, startPlan, stopPlan };
}

interface ReadingPlanState {
  planId: string;
  isActive: boolean;
  startDate: string | null;
  currentDay: number;            // 0 if not started, capped at totalDays
  totalDays: number;
  todayReadings: ReadingPlanRef[];
  daysCompleted: number;         // count of days where every reading is in readingProgress
}

/**
 * Snapshot of a plan with progress derived from readingProgress.
 * Live-queries readingProgress so progress updates instantly when a chapter
 * is marked read elsewhere.
 */
export function useReadingPlanProgress(planId: string): ReadingPlanState | null {
  const { active } = useActivePlan();

  const completedKeys = useLiveQuery(
    async () => {
      const rows = await db.readingProgress.toArray();
      const set = new Set<string>();
      for (const r of rows) set.add(`${r.book}:${r.chapter}`);
      return set;
    },
    [],
    new Set<string>()
  );

  const plan = getReadingPlan(planId);
  if (!plan) return null;

  const isActive = active?.planId === planId;
  const startDate = isActive ? active!.startDate : null;
  const currentDay = startDate ? getCurrentDay(startDate, plan.totalDays) : 0;

  const todayReadings =
    currentDay > 0 && currentDay <= plan.totalDays
      ? plan.days[currentDay - 1]?.readings ?? []
      : [];

  let daysCompleted = 0;
  for (const day of plan.days) {
    if (day.readings.length === 0) continue;
    const allRead = day.readings.every((r) =>
      completedKeys.has(`${r.bookId}:${r.chapter}`)
    );
    if (allRead) daysCompleted++;
  }

  return {
    planId,
    isActive,
    startDate,
    currentDay,
    totalDays: plan.totalDays,
    todayReadings,
    daysCompleted,
  };
}

/**
 * Helper: is the given chapter marked as read?
 * Uses the same live-queried set as useReadingPlanProgress.
 */
export function useIsChapterRead(): (ref: ReadingPlanRef) => boolean {
  const completedKeys = useLiveQuery(
    async () => {
      const rows = await db.readingProgress.toArray();
      const set = new Set<string>();
      for (const r of rows) set.add(`${r.book}:${r.chapter}`);
      return set;
    },
    [],
    new Set<string>()
  );
  return (ref) => completedKeys.has(`${ref.bookId}:${ref.chapter}`);
}
