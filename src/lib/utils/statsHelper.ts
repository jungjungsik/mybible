import { db } from '@/lib/db/index';
import { ReadingSession } from '@/types/bible';

// ── Query helpers ──

export async function getReadingSessionsByDateRange(
  start: string,
  end: string
): Promise<ReadingSession[]> {
  return db.readingSessions
    .where('date')
    .between(start, end, true, true)
    .toArray();
}

export async function getAllReadingSessions(): Promise<ReadingSession[]> {
  return db.readingSessions.toArray();
}

// ── Stats computation ──

export interface DailyStat {
  date: string;
  totalMs: number;
}

export function getDailyStats(sessions: ReadingSession[]): DailyStat[] {
  const map = new Map<string, number>();
  for (const s of sessions) {
    map.set(s.date, (map.get(s.date) ?? 0) + s.durationMs);
  }
  return Array.from(map.entries())
    .map(([date, totalMs]) => ({ date, totalMs }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface WeeklyStat {
  weekStart: string; // Monday date string
  totalMs: number;
}

function getMonday(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return formatDate(d);
}

export function getWeeklyStats(sessions: ReadingSession[]): WeeklyStat[] {
  const map = new Map<string, number>();
  for (const s of sessions) {
    const weekStart = getMonday(s.date);
    map.set(weekStart, (map.get(weekStart) ?? 0) + s.durationMs);
  }
  return Array.from(map.entries())
    .map(([weekStart, totalMs]) => ({ weekStart, totalMs }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

export interface MonthlyStat {
  month: string; // 'YYYY-MM'
  totalMs: number;
}

export function getMonthlyStats(sessions: ReadingSession[]): MonthlyStat[] {
  const map = new Map<string, number>();
  for (const s of sessions) {
    const month = s.date.slice(0, 7);
    map.set(month, (map.get(month) ?? 0) + s.durationMs);
  }
  return Array.from(map.entries())
    .map(([month, totalMs]) => ({ month, totalMs }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// ── Streak ──

export function getStreak(sessions: ReadingSession[]): number {
  if (sessions.length === 0) return 0;

  const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  // Streak must include today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1] + 'T00:00:00');
    prev.setDate(prev.getDate() - 1);
    if (formatDate(prev) === uniqueDates[i]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ── Formatting ──

export function formatDuration(ms: number): string {
  if (ms < 60000) {
    const sec = Math.round(ms / 1000);
    return `${sec}초`;
  }
  const totalMin = Math.floor(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  if (hours > 0) {
    return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
  }
  return `${minutes}분`;
}

// ── Date helpers ──

export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getStartOfWeek(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getStartOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getEndOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Get last 7 days as date strings */
export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}
