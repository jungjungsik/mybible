import { describe, expect, it } from 'vitest';
import { READING_PLANS, getCurrentDay, getReadingPlan } from './readingPlans';

describe('READING_PLANS', () => {
  it('exposes one-year, 30-day-nt, and 90-day-ot plans', () => {
    const ids = READING_PLANS.map((p) => p.id);
    expect(ids).toContain('one-year');
    expect(ids).toContain('30-day-nt');
    expect(ids).toContain('90-day-ot');
  });

  it('one-year plan covers all 1,189 chapters across 365 days', () => {
    const plan = getReadingPlan('one-year')!;
    expect(plan.days).toHaveLength(365);
    const total = plan.days.reduce((acc, d) => acc + d.readings.length, 0);
    expect(total).toBe(1189);
  });

  it('30-day-nt plan covers all 260 NT chapters across 30 days', () => {
    const plan = getReadingPlan('30-day-nt')!;
    expect(plan.days).toHaveLength(30);
    const total = plan.days.reduce((acc, d) => acc + d.readings.length, 0);
    expect(total).toBe(260);
    // First reading should be Matthew 1
    expect(plan.days[0].readings[0]).toEqual({ bookId: 'MAT', chapter: 1 });
  });

  it('90-day-ot plan covers all 929 OT chapters across 90 days', () => {
    const plan = getReadingPlan('90-day-ot')!;
    expect(plan.days).toHaveLength(90);
    const total = plan.days.reduce((acc, d) => acc + d.readings.length, 0);
    expect(total).toBe(929);
    expect(plan.days[0].readings[0]).toEqual({ bookId: 'GEN', chapter: 1 });
  });
});

describe('getCurrentDay', () => {
  it('returns 1 when today equals start date', () => {
    const today = new Date(2026, 0, 1);
    expect(getCurrentDay('2026-01-01', 365, today)).toBe(1);
  });

  it('returns 0 when start date is in the future', () => {
    const today = new Date(2026, 0, 1);
    expect(getCurrentDay('2026-01-05', 365, today)).toBe(0);
  });

  it('returns N+1 after N days have passed', () => {
    const today = new Date(2026, 0, 11);
    expect(getCurrentDay('2026-01-01', 365, today)).toBe(11);
  });

  it('caps at totalDays after plan duration', () => {
    const today = new Date(2027, 0, 1); // > 365 days later
    expect(getCurrentDay('2026-01-01', 365, today)).toBe(365);
  });

  it('handles 30-day plan boundary', () => {
    const today = new Date(2026, 0, 30);
    expect(getCurrentDay('2026-01-01', 30, today)).toBe(30);
    const after = new Date(2026, 1, 5);
    expect(getCurrentDay('2026-01-01', 30, after)).toBe(30);
  });
});
