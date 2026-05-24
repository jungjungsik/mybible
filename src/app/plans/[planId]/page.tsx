'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { getReadingPlan } from '@/lib/constants/readingPlans';
import {
  useActivePlan,
  useIsChapterRead,
  useReadingPlanProgress,
} from '@/hooks/useReadingPlan';
import { getBookById } from '@/lib/constants/books';
import { ReadingPlanRef } from '@/types/bible';
import { CheckCircle2, Circle, Play, Square, ChevronRight, Calendar } from 'lucide-react';

interface PageProps {
  params: { planId: string };
}

export default function PlanDetailPage({ params }: PageProps) {
  const { planId } = params;
  const router = useRouter();
  const plan = getReadingPlan(planId);
  const state = useReadingPlanProgress(planId);
  const { startPlan, stopPlan } = useActivePlan();
  const isRead = useIsChapterRead();
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  if (!plan || !state) {
    return (
      <>
        <Header title="통독 계획" showBack />
        <main className="p-4 text-center text-bible-text-secondary">
          존재하지 않는 계획입니다.
        </main>
      </>
    );
  }

  const { isActive, currentDay, totalDays, todayReadings, daysCompleted } = state;
  const percent = Math.round((daysCompleted / totalDays) * 100);

  return (
    <>
      <Header title={plan.name} showBack />
      <main className="p-4 pb-24 space-y-5 max-w-2xl mx-auto">
        {/* Summary */}
        <section className="card p-5">
          <p className="text-sm font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark mb-4">
            {plan.description}
          </p>
          {isActive ? (
            <>
              <div className="flex items-center justify-between text-xs font-sans mb-2">
                <span className="text-bible-text-secondary dark:text-bible-text-secondary-dark">
                  {currentDay}일차 / {totalDays}일
                </span>
                <span className="text-bible-accent font-medium">
                  {daysCompleted}일 완독 · {percent}%
                </span>
              </div>
              <div className="h-2 w-full bg-bible-surface dark:bg-bible-surface-dark rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-bible-accent transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <button
                onClick={() => setShowStopConfirm(true)}
                className="btn-secondary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <Square size={14} />
                계획 중단
              </button>
            </>
          ) : (
            <button
              onClick={() => startPlan(planId)}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              <Play size={16} />
              계획 시작
            </button>
          )}
        </section>

        {/* Today's readings */}
        {isActive && currentDay > 0 && (
          <section className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-bible-accent" />
              <h2 className="font-display text-base font-semibold text-bible-text dark:text-bible-text-dark">
                오늘의 통독 ({currentDay}일차)
              </h2>
            </div>
            {todayReadings.length === 0 ? (
              <p className="text-sm font-sans text-bible-text-secondary">
                오늘은 읽을 분량이 없습니다.
              </p>
            ) : (
              <div className="space-y-1.5">
                {todayReadings.map((ref) => (
                  <ReadingRow
                    key={`${ref.bookId}-${ref.chapter}`}
                    ref_={ref}
                    isRead={isRead(ref)}
                    onClick={() => router.push(`/read/${ref.bookId}/${ref.chapter}`)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* All days */}
        <section className="card p-5">
          <h2 className="font-display text-base font-semibold text-bible-text dark:text-bible-text-dark mb-3">
            전체 일정
          </h2>
          <div className="space-y-1">
            {plan.days.map((d) => {
              const allRead = d.readings.length > 0 && d.readings.every(isRead);
              const isToday = isActive && d.day === currentDay;
              return (
                <div
                  key={d.day}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    isToday
                      ? 'bg-bible-accent/10 border border-bible-accent/30'
                      : ''
                  }`}
                >
                  <span className="font-sans flex items-center gap-2">
                    {allRead ? (
                      <CheckCircle2 size={14} className="text-bible-accent flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-bible-text-secondary/40 flex-shrink-0" />
                    )}
                    <span className="text-bible-text-secondary dark:text-bible-text-secondary-dark min-w-[36px]">
                      {d.day}일
                    </span>
                    <span className="text-bible-text dark:text-bible-text-dark">
                      {formatReadings(d.readings)}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <ConfirmDialog
        isOpen={showStopConfirm}
        title="계획을 중단하시겠습니까?"
        message="진행 중인 통독 계획을 중단합니다. 읽기 진행 기록은 그대로 유지됩니다."
        confirmText="중단"
        cancelText="취소"
        onConfirm={() => {
          stopPlan();
          setShowStopConfirm(false);
        }}
        onCancel={() => setShowStopConfirm(false)}
      />
    </>
  );
}

function ReadingRow({
  ref_,
  isRead,
  onClick,
}: {
  ref_: ReadingPlanRef;
  isRead: boolean;
  onClick: () => void;
}) {
  const book = getBookById(ref_.bookId);
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-bible-surface dark:hover:bg-bible-surface-dark transition-colors"
    >
      <span className="flex items-center gap-2 text-sm font-sans">
        {isRead ? (
          <CheckCircle2 size={16} className="text-bible-accent" />
        ) : (
          <Circle size={16} className="text-bible-text-secondary/40" />
        )}
        <span
          className={
            isRead
              ? 'text-bible-text-secondary dark:text-bible-text-secondary-dark line-through'
              : 'text-bible-text dark:text-bible-text-dark font-medium'
          }
        >
          {book?.name ?? ref_.bookId} {ref_.chapter}장
        </span>
      </span>
      <ChevronRight size={14} className="text-bible-text-secondary/40" />
    </button>
  );
}

function formatReadings(refs: ReadingPlanRef[]): string {
  if (refs.length === 0) return '';

  // Group consecutive chapters within the same book.
  const groups: Array<{ bookId: string; chapters: number[] }> = [];
  for (const r of refs) {
    const last = groups[groups.length - 1];
    if (last && last.bookId === r.bookId) last.chapters.push(r.chapter);
    else groups.push({ bookId: r.bookId, chapters: [r.chapter] });
  }

  return groups
    .map((g) => {
      const book = getBookById(g.bookId);
      const name = book?.shortName ?? g.bookId;
      const sorted = [...g.chapters].sort((a, b) => a - b);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const range = first === last ? `${first}` : `${first}-${last}`;
      return `${name} ${range}`;
    })
    .join(', ');
}
