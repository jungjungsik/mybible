'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ReadingSession } from '@/types/bible';
import {
  getAllReadingSessions,
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getStreak,
  formatDuration,
  formatDate,
  getLast7Days,
  getDaysInMonth,
  getFirstDayOfMonth,
} from '@/lib/utils/statsHelper';
import { Flame, Clock, CalendarDays, TrendingUp } from 'lucide-react';

type Period = 'daily' | 'weekly' | 'monthly';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function StatsPage() {
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('daily');

  useEffect(() => {
    getAllReadingSessions().then((data) => {
      setSessions(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <>
        <Header title="읽기 통계" showBack />
        <main className="p-4 pb-24">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            ))}
          </div>
        </main>
      </>
    );
  }

  const today = formatDate(new Date());
  const dailyStats = getDailyStats(sessions);
  const todayMs = dailyStats.find((d) => d.date === today)?.totalMs ?? 0;

  // This week
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));
  const weekStart = formatDate(startOfWeek);
  const weeklyStats = getWeeklyStats(sessions);
  const thisWeekMs = weeklyStats.find((w) => w.weekStart === weekStart)?.totalMs ?? 0;

  // This month
  const currentMonth = today.slice(0, 7);
  const monthlyStats = getMonthlyStats(sessions);
  const thisMonthMs = monthlyStats.find((m) => m.month === currentMonth)?.totalMs ?? 0;

  // Streak
  const streak = getStreak(sessions);

  // Last 7 days for bar chart
  const last7 = getLast7Days();
  const dailyMap = new Map(dailyStats.map((d) => [d.date, d.totalMs]));
  const last7Data = last7.map((date) => ({
    date,
    ms: dailyMap.get(date) ?? 0,
    label: DAY_LABELS[new Date(date + 'T00:00:00').getDay()],
  }));
  const maxDayMs = Math.max(...last7Data.map((d) => d.ms), 1);

  // Calendar heatmap for current month
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const calendarDays: { day: number; ms: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, ms: dailyMap.get(dateStr) ?? 0 });
  }
  const maxMonthDayMs = Math.max(...calendarDays.map((c) => c.ms), 1);

  function getHeatColor(ms: number): string {
    if (ms === 0) return 'bg-bible-surface dark:bg-bible-surface-dark';
    const ratio = ms / maxMonthDayMs;
    if (ratio < 0.25) return 'bg-bible-accent/20';
    if (ratio < 0.5) return 'bg-bible-accent/40';
    if (ratio < 0.75) return 'bg-bible-accent/60';
    return 'bg-bible-accent/90';
  }

  // Period detail data
  const renderPeriodDetail = () => {
    if (period === 'daily') {
      const recent = [...dailyStats].reverse().slice(0, 14);
      if (recent.length === 0) return <EmptyState />;
      return (
        <div className="space-y-2">
          {recent.map((d) => (
            <div key={d.date} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-bible-surface dark:bg-bible-surface-dark">
              <span className="text-sm font-sans text-bible-text dark:text-bible-text-dark">
                {formatDateLabel(d.date)}
              </span>
              <span className="text-sm font-mono text-bible-accent font-medium">
                {formatDuration(d.totalMs)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    if (period === 'weekly') {
      const recent = [...weeklyStats].reverse().slice(0, 8);
      if (recent.length === 0) return <EmptyState />;
      return (
        <div className="space-y-2">
          {recent.map((w) => (
            <div key={w.weekStart} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-bible-surface dark:bg-bible-surface-dark">
              <span className="text-sm font-sans text-bible-text dark:text-bible-text-dark">
                {formatDateLabel(w.weekStart)} 주
              </span>
              <span className="text-sm font-mono text-bible-accent font-medium">
                {formatDuration(w.totalMs)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    // monthly
    const recent = [...monthlyStats].reverse().slice(0, 6);
    if (recent.length === 0) return <EmptyState />;
    return (
      <div className="space-y-2">
        {recent.map((m) => (
          <div key={m.month} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-bible-surface dark:bg-bible-surface-dark">
            <span className="text-sm font-sans text-bible-text dark:text-bible-text-dark">
              {formatMonthLabel(m.month)}
            </span>
            <span className="text-sm font-mono text-bible-accent font-medium">
              {formatDuration(m.totalMs)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header title="읽기 통계" showBack />
      <main className="p-4 pb-24 space-y-5 max-w-2xl mx-auto">

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard icon={<Clock size={18} />} label="오늘" value={formatDuration(todayMs)} />
          <SummaryCard icon={<CalendarDays size={18} />} label="이번 주" value={formatDuration(thisWeekMs)} />
          <SummaryCard icon={<TrendingUp size={18} />} label="이번 달" value={formatDuration(thisMonthMs)} />
          <SummaryCard icon={<Flame size={18} />} label="연속 읽기" value={`${streak}일`} highlight />
        </div>

        {/* ── Weekly Bar Chart ── */}
        <section className="card p-4">
          <p className="text-xs font-display text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-widest mb-4">
            최근 7일
          </p>
          <div className="flex items-end justify-between gap-2 h-32">
            {last7Data.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-bible-text-secondary dark:text-bible-text-secondary-dark">
                  {d.ms > 0 ? formatDuration(d.ms) : ''}
                </span>
                <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                  <div
                    className="w-full max-w-[32px] rounded-t-md bg-bible-accent/70 dark:bg-bible-accent/80 transition-all duration-300"
                    style={{
                      height: d.ms > 0 ? `${Math.max((d.ms / maxDayMs) * 100, 8)}%` : '2px',
                      opacity: d.ms > 0 ? 1 : 0.3,
                    }}
                  />
                </div>
                <span className={`text-xs font-sans ${
                  d.date === today
                    ? 'text-bible-accent font-bold'
                    : 'text-bible-text-secondary dark:text-bible-text-secondary-dark'
                }`}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Monthly Calendar Heatmap ── */}
        <section className="card p-4">
          <p className="text-xs font-display text-bible-text-secondary dark:text-bible-text-secondary-dark uppercase tracking-widest mb-3">
            {year}년 {month + 1}월
          </p>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LABELS.map((label) => (
              <div key={label} className="text-center text-[10px] font-sans text-bible-text-secondary/60 dark:text-bible-text-secondary-dark/60">
                {label}
              </div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {calendarDays.map((cd) => {
              const isToday = cd.day === now.getDate();
              return (
                <div
                  key={cd.day}
                  className={`aspect-square rounded-md flex items-center justify-center text-xs font-sans transition-colors ${getHeatColor(cd.ms)} ${
                    isToday ? 'ring-2 ring-bible-accent ring-offset-1 ring-offset-bible-bg dark:ring-offset-bible-bg-dark' : ''
                  }`}
                  title={cd.ms > 0 ? formatDuration(cd.ms) : ''}
                >
                  <span className={`${cd.ms > 0 ? 'text-bible-text dark:text-bible-text-dark font-medium' : 'text-bible-text-secondary/50 dark:text-bible-text-secondary-dark/50'}`}>
                    {cd.day}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[10px] text-bible-text-secondary dark:text-bible-text-secondary-dark">적게</span>
            <div className="w-3 h-3 rounded-sm bg-bible-accent/20" />
            <div className="w-3 h-3 rounded-sm bg-bible-accent/40" />
            <div className="w-3 h-3 rounded-sm bg-bible-accent/60" />
            <div className="w-3 h-3 rounded-sm bg-bible-accent/90" />
            <span className="text-[10px] text-bible-text-secondary dark:text-bible-text-secondary-dark">많이</span>
          </div>
        </section>

        {/* ── Period Tabs + Detail ── */}
        <section className="card p-4">
          <div className="flex gap-1 p-1 bg-bible-surface dark:bg-bible-surface-dark rounded-xl mb-4">
            {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2 text-xs font-sans font-medium rounded-lg transition-colors ${
                  period === p
                    ? 'bg-bible-accent text-white shadow-warm'
                    : 'text-bible-text-secondary dark:text-bible-text-secondary-dark hover:text-bible-text dark:hover:text-bible-text-dark'
                }`}
              >
                {p === 'daily' ? '일별' : p === 'weekly' ? '주별' : '월별'}
              </button>
            ))}
          </div>
          {renderPeriodDetail()}
        </section>

      </main>
    </>
  );
}

// ── Sub components ──

function SummaryCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`card p-4 ${highlight ? 'border-bible-accent/30 dark:border-bible-accent/30' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-bible-accent">{icon}</span>
        <span className="text-xs font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">{label}</span>
      </div>
      <p className={`text-xl font-display font-bold ${highlight ? 'text-bible-accent' : 'text-bible-text dark:text-bible-text-dark'}`}>
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <p className="text-sm font-sans text-bible-text-secondary dark:text-bible-text-secondary-dark">
        아직 읽기 기록이 없습니다
      </p>
      <p className="text-xs font-sans text-bible-text-secondary/60 dark:text-bible-text-secondary-dark/60 mt-1">
        성경을 읽으면 자동으로 기록됩니다
      </p>
    </div>
  );
}

// ── Label helpers ──

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_LABELS[d.getDay()]})`;
}

function formatMonthLabel(monthStr: string): string {
  const [y, m] = monthStr.split('-');
  return `${y}년 ${parseInt(m)}월`;
}
