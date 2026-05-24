'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { READING_PLANS } from '@/lib/constants/readingPlans';
import { useActivePlan, useReadingPlanProgress } from '@/hooks/useReadingPlan';
import { Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export default function PlansPage() {
  const router = useRouter();
  const { active } = useActivePlan();

  return (
    <>
      <Header title="통독 계획" showBack />
      <main className="p-4 pb-24 space-y-4 max-w-2xl mx-auto">
        <p className="text-sm font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark px-1">
          매일 정해진 분량을 꾸준히 읽어 성경 전체를 통독해보세요.
        </p>

        {READING_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            planId={plan.id}
            isActive={active?.planId === plan.id}
            onClick={() => router.push(`/plans/${plan.id}`)}
          />
        ))}
      </main>
    </>
  );
}

interface PlanCardProps {
  planId: string;
  isActive: boolean;
  onClick: () => void;
}

function PlanCard({ planId, onClick }: PlanCardProps) {
  const state = useReadingPlanProgress(planId);
  if (!state) return null;

  const { isActive, currentDay, totalDays, daysCompleted } = state;
  const percent = Math.round((daysCompleted / totalDays) * 100);

  // Pull plan metadata for display
  const plan = READING_PLANS.find((p) => p.id === planId)!;

  return (
    <button
      onClick={onClick}
      className="card w-full p-5 text-left active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-bible-accent" />
            <h2 className="font-display text-lg font-semibold text-bible-text dark:text-bible-text-dark">
              {plan.name}
            </h2>
            {isActive && (
              <span className="text-[10px] font-sans font-semibold bg-bible-accent text-white px-2 py-0.5 rounded-full">
                진행 중
              </span>
            )}
          </div>
          <p className="text-sm font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
            {plan.description}
          </p>
        </div>
        <ChevronRight size={18} className="text-bible-text-secondary/50 dark:text-bible-text-secondary-dark/50 flex-shrink-0 mt-1" />
      </div>

      {isActive && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-bible-text-secondary dark:text-bible-text-secondary-dark">
              {currentDay}일차 / 총 {totalDays}일
            </span>
            <span className="flex items-center gap-1 text-bible-accent font-medium">
              <CheckCircle2 size={12} />
              {daysCompleted}일 완독 ({percent}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-bible-surface dark:bg-bible-surface-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-bible-accent transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
}
