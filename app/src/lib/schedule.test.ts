import { describe, expect, it } from "vitest";
import {
  instantFor,
  nextOccurrence,
  partsInAuthorZone,
  type Recurrence,
  type ScheduledSession,
} from "./schedule";

// Every case below passes an explicit `from` via instantFor (never relies on
// real `new Date()`), so results are deterministic regardless of when the
// suite runs. Reference dates are verified real-world calendar facts (day of
// week, month lengths), not just re-derivations of the code under test.

function session(overrides: Partial<ScheduledSession> & { recurrence: Recurrence; weekday: number }): ScheduledSession {
  return {
    id: "test-session",
    title: "Test Session",
    kind: "class",
    startHour: 10,
    startMinute: 0,
    durationMinutes: 60,
    ageRange: "All ages",
    description: "A test session.",
    ...overrides,
  };
}

describe("nextOccurrence — weekly", () => {
  // 2026-08-04 and 2026-08-11 are both real-world Tuesdays.
  const tuesday10am = session({ weekday: 2, startHour: 10, startMinute: 0, recurrence: { type: "weekly" } });

  it("returns later today when queried just before the start time", () => {
    const from = instantFor(2026, 8, 4, 9, 59);
    expect(nextOccurrence(tuesday10am, from)).toEqual(instantFor(2026, 8, 4, 10, 0));
  });

  it("stays on today's occurrence within the grace period after start", () => {
    // 30 min after a 60-min-duration session's start — still within grace.
    const from = instantFor(2026, 8, 4, 10, 30);
    expect(nextOccurrence(tuesday10am, from)).toEqual(instantFor(2026, 8, 4, 10, 0));
  });

  it("rolls to next week once the grace period has fully elapsed", () => {
    // 61 min after start — outside the 60-min grace window.
    const from = instantFor(2026, 8, 4, 11, 1);
    expect(nextOccurrence(tuesday10am, from)).toEqual(instantFor(2026, 8, 11, 10, 0));
  });
});

describe("nextOccurrence — monthly-nth-weekday", () => {
  // April 2026 has Wednesdays on 1, 8, 15, 22, 29 (5 of them — the case most
  // likely to expose an nth=-1 off-by-one). May 2026's Wednesdays are 6, 13,
  // 20, 27.
  const wednesday = 3;

  it.each([
    [1, 1],
    [2, 8],
    [3, 15],
    [4, 22],
  ] as const)("nth=%d resolves to April %d, 2026", (nth, expectedDay) => {
    const s = session({ weekday: wednesday, recurrence: { type: "monthly-nth-weekday", nth } });
    const from = instantFor(2026, 4, 1, 0, 0);
    expect(nextOccurrence(s, from)).toEqual(instantFor(2026, 4, expectedDay, 10, 0));
  });

  it("nth=-1 (last) picks the 5th Wednesday, not the 4th", () => {
    const s = session({ weekday: wednesday, recurrence: { type: "monthly-nth-weekday", nth: -1 } });
    const from = instantFor(2026, 4, 1, 0, 0);
    expect(nextOccurrence(s, from)).toEqual(instantFor(2026, 4, 29, 10, 0));
  });

  it("rolls forward to next month once this month's occurrence has passed", () => {
    const s = session({ weekday: wednesday, recurrence: { type: "monthly-nth-weekday", nth: 1 } });
    const from = instantFor(2026, 4, 2, 0, 0); // day after April's 1st Wednesday
    expect(nextOccurrence(s, from)).toEqual(instantFor(2026, 5, 6, 10, 0));
  });
});

describe("nextOccurrence — seasonal-weekly", () => {
  // Real SAMPLE_SCHEDULE-shaped season: May 1 – Aug 31, Tuesdays.
  const mayToAugTuesday = session({
    weekday: 2,
    recurrence: { type: "seasonal-weekly", startMonth: 5, startDay: 1, endMonth: 8, endDay: 31 },
  });

  it("before the season, resolves to the first in-season Tuesday", () => {
    const from = instantFor(2026, 4, 30, 0, 0); // day before season starts (May 1 is a Friday)
    expect(nextOccurrence(mayToAugTuesday, from)).toEqual(instantFor(2026, 5, 5, 10, 0));
  });

  it("in season, behaves like a normal weekly match", () => {
    const from = instantFor(2026, 8, 20, 0, 0); // Thursday, mid-season
    expect(nextOccurrence(mayToAugTuesday, from)).toEqual(instantFor(2026, 8, 25, 10, 0));
  });

  it("after the season ends, rolls forward to next year's season start", () => {
    const from = instantFor(2026, 9, 1, 0, 0); // first Tuesday after the season ends
    expect(nextOccurrence(mayToAugTuesday, from)).toEqual(instantFor(2027, 5, 4, 10, 0));
  });

  it("respects an exact day boundary — included on endDay, excluded the day after", () => {
    // Narrow synthetic season: June 10-23, Wednesdays. June 2026 Wednesdays:
    // 3, 10, 17, 24. June 2027 Wednesdays: 2, 9, 16, 23, 30.
    const narrowSeason = session({
      weekday: 3,
      recurrence: { type: "seasonal-weekly", startMonth: 6, startDay: 10, endMonth: 6, endDay: 23 },
    });
    // June 10 (in season, exactly on startDay) is a real match:
    expect(nextOccurrence(narrowSeason, instantFor(2026, 6, 9, 0, 0))).toEqual(instantFor(2026, 6, 10, 10, 0));
    // From just after June 17's occurrence: June 24 falls one day past
    // endDay (23), so it's excluded — the next in-season Wednesday is next
    // year's June 16 (2027), not this year's June 24.
    const from = instantFor(2026, 6, 18, 0, 0);
    expect(nextOccurrence(narrowSeason, from)).toEqual(instantFor(2027, 6, 16, 10, 0));
  });
});

describe("instantFor / partsInAuthorZone round-trip", () => {
  it("round-trips correctly for a DST-adjacent (non-ambiguous) date", () => {
    // 2026-03-08 is the US "spring forward" transition Sunday in
    // America/Denver; 2026-03-09 at 10am is the very next day, comfortably
    // outside the 1am-3am transition window the code documents as its one
    // known-dormant edge case.
    const instant = instantFor(2026, 3, 9, 10, 0);
    const parts = partsInAuthorZone(instant);
    expect(parts).toEqual({ year: 2026, month: 3, day: 9, weekday: 1 }); // Monday
  });
});
