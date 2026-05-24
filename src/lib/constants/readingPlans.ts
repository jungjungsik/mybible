import { BibleBook, ReadingPlan, ReadingPlanDay, ReadingPlanRef } from '@/types/bible';
import { BIBLE_BOOKS, getOldTestament, getNewTestament } from '@/lib/constants/books';

/**
 * Split a flat ordered list of chapters into `totalDays` buckets as evenly
 * as possible. Used to generate fixed-length linear reading plans.
 */
function distributeChapters(
  books: BibleBook[],
  totalDays: number
): ReadingPlanDay[] {
  const refs: ReadingPlanRef[] = [];
  for (const book of books) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      refs.push({ bookId: book.id, chapter: ch });
    }
  }

  const days: ReadingPlanDay[] = [];
  for (let day = 1; day <= totalDays; day++) {
    const start = Math.floor(((day - 1) * refs.length) / totalDays);
    const end = Math.floor((day * refs.length) / totalDays);
    days.push({ day, readings: refs.slice(start, end) });
  }
  return days;
}

// ── Plan definitions ──

const ONE_YEAR_PLAN: ReadingPlan = {
  id: 'one-year',
  name: '1년 통독',
  description: '365일 동안 성경 전체를 매일 약 3-4장씩 통독합니다.',
  totalDays: 365,
  days: distributeChapters(BIBLE_BOOKS, 365),
};

const THIRTY_DAY_NT_PLAN: ReadingPlan = {
  id: '30-day-nt',
  name: '30일 신약',
  description: '신약 27권을 30일 동안 매일 약 8-9장씩 읽습니다.',
  totalDays: 30,
  days: distributeChapters(getNewTestament(), 30),
};

const NINETY_DAY_OT_PLAN: ReadingPlan = {
  id: '90-day-ot',
  name: '90일 구약',
  description: '구약 39권을 90일 동안 매일 약 10장씩 읽습니다.',
  totalDays: 90,
  days: distributeChapters(getOldTestament(), 90),
};

export const READING_PLANS: ReadingPlan[] = [
  ONE_YEAR_PLAN,
  THIRTY_DAY_NT_PLAN,
  NINETY_DAY_OT_PLAN,
];

export function getReadingPlan(id: string): ReadingPlan | undefined {
  return READING_PLANS.find((p) => p.id === id);
}

/**
 * Day index (1-based) for a plan given its start date, clamped to plan length.
 * Returns 0 if startDate is in the future, totalDays if past completion.
 */
export function getCurrentDay(startDate: string, totalDays: number, now = new Date()): number {
  const start = new Date(startDate + 'T00:00:00');
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays < 0) return 0;
  return Math.min(diffDays + 1, totalDays);
}
