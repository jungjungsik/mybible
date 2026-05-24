'use client';

import Link from 'next/link';
import { Calendar, CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { getReadingPlan } from '@/lib/constants/readingPlans';
import { useActivePlan, useIsChapterRead, useReadingPlanProgress } from '@/hooks/useReadingPlan';
import { getBookById } from '@/lib/constants/books';
import { ReadingPlanRef } from '@/types/bible';

export function TodayPlanCard() {
  const { active, isLoading } = useActivePlan();

  if (isLoading) return null;

  if (!active) {
    return (
      <Link
        href="/plans"
        className="card p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
      >
        <div className="w-10 h-10 rounded-full bg-bible-accent/10 flex items-center justify-center flex-shrink-0">
          <Calendar size={18} className="text-bible-accent" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-sans font-medium text-bible-text dark:text-bible-text-dark">통독 계획 시작하기</p>
          <p className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
            매일 정해진 분량을 꾸준히 읽어 보세요
          </p>
        </div>
        <ChevronRight size={16} className="text-bible-text-secondary/50 dark:text-bible-text-secondary-dark/50" />
      </Link>
    );
  }

  return <ActiveTodayCard planId={active.planId} />;
}

function ActiveTodayCard({ planId }: { planId: string }) {
  const state = useReadingPlanProgress(planId);
  const isRead = useIsChapterRead();
  const plan = getReadingPlan(planId);
  if (!state || !plan) return null;

  const { currentDay, totalDays, todayReadings, daysCompleted } = state;
  const percent = Math.round((daysCompleted / totalDays) * 100);
  const allDoneToday = todayReadings.length > 0 && todayReadings.every(isRead);

  return (
    <Link
      href={`/plans/${planId}`}
      className="card p-5 block active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-bible-accent" />
          <p className="text-xs font-display text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-widest">
            오늘의 통독 · {plan.name}
          </p>
        </div>
        <span className="text-xs font-sans text-bible-accent font-medium">
          {currentDay}/{totalDays}일
        </span>
      </div>

      {todayReadings.length === 0 ? (
        <p className="text-sm font-sans text-bible-text-secondary">오늘은 읽을 분량이 없습니다.</p>
      ) : (
        <div className="space-y-1.5 mb-3">
          {todayReadings.map((ref) => (
            <RowPreview key={`${ref.bookId}-${ref.chapter}`} ref_={ref} isRead={isRead(ref)} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="h-1.5 flex-1 bg-bible-surface dark:bg-bible-surface-dark rounded-full overflow-hidden mr-3">
          <div className="h-full bg-bible-accent transition-all" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
          {allDoneToday ? '오늘 완독 ✓' : `${percent}%`}
        </span>
      </div>
    </Link>
  );
}

function RowPreview({ ref_, isRead }: { ref_: ReadingPlanRef; isRead: boolean }) {
  const book = getBookById(ref_.bookId);
  return (
    <div className="flex items-center gap-2 text-sm font-sans">
      {isRead ? (
        <CheckCircle2 size={14} className="text-bible-accent flex-shrink-0" />
      ) : (
        <Circle size={14} className="text-bible-text-secondary/40 flex-shrink-0" />
      )}
      <span
        className={
          isRead
            ? 'text-bible-text-secondary dark:text-bible-text-secondary-dark line-through'
            : 'text-bible-text dark:text-bible-text-dark'
        }
      >
        {book?.name ?? ref_.bookId} {ref_.chapter}장
      </span>
    </div>
  );
}
