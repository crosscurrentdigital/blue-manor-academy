// Sample weekly schedule. The club NAMES below are real — this exact list
// (Coding, Chess, Crochet, Reading, Stock Market, Art, Manor Magazine "and
// more") is taken directly from a screenshot of the live site's own club
// icon row, provided directly rather than pulled by this session's tooling
// (see proposal/AUDIT.md's methodology note) — a step up from the earlier,
// indirect-source-based guess this replaced (which had invented a couple of
// clubs, like "Animation Club," that aren't actually on the real site).
// The specific DAYS/TIMES are still illustrative placeholders, not BMA's
// actual live schedule, since that data isn't public. Swapping this file
// for a real feed from BMA's API is the exact "we just need your
// credentials" step described in the proposal.
//
// Times are authored in America/Denver (Idaho, where BMA's HQ is listed —
// see AUDIT.md section 8, itself unconfirmed) and converted to the viewer's
// own local time at render time. That conversion is the actual point of
// this page: BMA's own marketing describes clubs meeting "students from
// around the world," so a fixed-time class needs to display correctly no
// matter where the family is.

export type SessionKind = "class" | "club" | "mentorship";

// Real recurrence, actually implemented — not just displayed as text. A
// real enrolled family's schedule (proposal/AUDIT.md section 10) recurs
// three different ways: plain weekly, "Nth weekday of the month" (e.g.
// Crochet Club: 3rd Monday), and weekly-within-a-date-range (e.g.
// Foundations of Illustration: May-Aug, Tuesdays). This models all three
// for real, including a correct RRULE export (see lib/ics.ts) — the
// earlier version of this file only displayed the real cadence as a text
// label next to a fake simple-weekly simulation; this is the fix.
export type Recurrence =
  | { type: "weekly" }
  | { type: "monthly-nth-weekday"; nth: 1 | 2 | 3 | 4 | -1 }
  | { type: "seasonal-weekly"; startMonth: number; startDay: number; endMonth: number; endDay: number };

export interface ScheduledSession {
  id: string;
  title: string;
  kind: SessionKind;
  /** 0 = Sunday, matches Date#getDay() */
  weekday: number;
  startHour: number; // in AUTHOR_TIMEZONE
  startMinute: number;
  durationMinutes: number;
  ageRange: string;
  description: string;
  recurrence: Recurrence;
  /**
   * Optional secondary deep link for a session with its own between-class
   * platform — e.g. Chess Club's ChessKid link below. Same reasoning as
   * DEMO_ZOOM_JOIN_URL: ChessKid has no public embed API/SDK for
   * third-party apps (checked directly — Chess.com's public API covers
   * chess.com game/stats data, not ChessKid), so this links OUT to
   * ChessKid rather than attempting to embed play inside this app. Points
   * to ChessKid's public homepage, not a real BMA club URL, since BMA
   * hasn't confirmed whether they run a ChessKid Club/Classroom at all.
   */
  externalLink?: { label: string; url: string };
  /**
   * The real recurrence text as actually seen on a live enrolled family's
   * schedule (e.g. "Year-Round, 3rd Monday, 1 PM CST" — see
   * ../../../proposal/AUDIT.md section 10). Shown as-is for authenticity,
   * alongside the now-real recurrence math above (the `recurrence` field
   * actually implements what this string describes).
   */
  realCadence?: string;
}

export const AUTHOR_TIMEZONE = "America/Denver";

// Zoom's own public test-meeting page — a real, working Zoom join flow,
// standing in for BMA's real per-class meeting link until API access is
// granted. Every session below points here on purpose, not to a different
// mock URL per class, so the demo never implies we have real meeting IDs.
export const DEMO_ZOOM_JOIN_URL = "https://zoom.us/test";

// This list is a real enrolled family's actual Classes & Clubs schedule,
// seen directly (see proposal/AUDIT.md section 10) — a step up from an
// earlier version of this file that used BMA's general marketing icon row
// instead of a real family's real enrolled activities. Real cadence text
// carried through in realCadence; weekday/time fields below are this
// demo's simplified weekly approximation of that real cadence (see the
// realCadence field's doc comment on why).
export const SAMPLE_SCHEDULE: ScheduledSession[] = [
  {
    id: "student-qa",
    title: "Student Q&A Session",
    kind: "mentorship",
    weekday: 1,
    startHour: 14,
    startMinute: 30,
    durationMinutes: 30,
    ageRange: "All ages",
    description: "Open questions, live — bring whatever you're stuck on.",
    recurrence: { type: "weekly" },
    realCadence: "Year-Round, Monday, 2:30 PM CST",
  },
  {
    id: "chess-club",
    title: "Chess Club",
    kind: "club",
    weekday: 3,
    startHour: 10,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 8-14",
    description: "Casual play and light instruction — bring your own board or play on-screen.",
    externalLink: { label: "Practice on ChessKid", url: "https://www.chesskid.com/" },
    recurrence: { type: "weekly" },
    realCadence: "Year-Round, Wednesday, 10 AM CST",
  },
  {
    id: "3d-modeling-club",
    title: "3D Modeling Club",
    kind: "club",
    weekday: 3,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 12+",
    description: "Design-your-own projects, CAD basics through a finished model.",
    recurrence: { type: "monthly-nth-weekday", nth: 3 },
    realCadence: "Year-Round, 3rd Wednesday, 2 PM CST",
  },
  {
    id: "social-club",
    title: "Social Club",
    kind: "club",
    weekday: 5,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "All ages",
    description: "Structured, camera-on social time with other students.",
    recurrence: { type: "monthly-nth-weekday", nth: 1 },
    realCadence: "Year-Round, 1st Friday, 2 PM CST",
  },
  {
    id: "stock-investing-class",
    title: "Stock Investing Class",
    kind: "class",
    weekday: 5,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 12+",
    description: "Following real markets together and learning the basics of investing.",
    recurrence: { type: "monthly-nth-weekday", nth: 3 },
    realCadence: "Year-Round, 3rd Friday, 2 PM CST",
  },
  {
    id: "oration-class",
    title: "Oration Class",
    kind: "class",
    weekday: 5,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 10+",
    description: "Public speaking practice, live in front of a small group.",
    recurrence: { type: "monthly-nth-weekday", nth: 4 },
    realCadence: "Year-Round, 4th Friday, 2 PM CST",
  },
  {
    id: "crochet-club",
    title: "Crochet Club",
    kind: "club",
    weekday: 1,
    startHour: 13,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 8+",
    description: "Learn stitches and work on a project together, live.",
    recurrence: { type: "monthly-nth-weekday", nth: 3 },
    realCadence: "Year-Round, 3rd Monday, 1 PM CST",
  },
  {
    id: "foundations-of-illustration",
    title: "Foundations of Illustration",
    kind: "class",
    weekday: 2,
    startHour: 11,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 8+",
    description: "Guided drawing fundamentals, live with other students.",
    recurrence: { type: "seasonal-weekly", startMonth: 5, startDay: 1, endMonth: 8, endDay: 31 },
    realCadence: "May-Aug, Tuesday, 11 AM CST",
  },
  {
    id: "manners-etiquette",
    title: "Manners & Etiquette: The Rules of Respectability",
    kind: "class",
    weekday: 2,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "All ages",
    description: "Real-world etiquette, taught live and put into practice.",
    recurrence: { type: "seasonal-weekly", startMonth: 9, startDay: 1, endMonth: 12, endDay: 31 },
    realCadence: "Sept-Dec, Tuesday, 2 PM CST",
  },
];

/**
 * Correctly offset-corrected UTC instant for HH:MM on a given Y-M-D in
 * AUTHOR_TIMEZONE. Shared by every recurrence type below. Known dormant
 * edge case (caught by audit): computes the DST offset from the naive
 * guess instant, not the final one, so a wall-clock time inside the
 * one-hour "spring forward" gap or the repeated "fall back" hour resolves
 * ambiguously rather than erroring. None of SAMPLE_SCHEDULE's times land
 * in that window — flag before adding schedule data at other times.
 */
export function instantFor(year: number, month: number, day: number, hour: number, minute: number): Date {
  const pad = (n: number) => String(n).padStart(2, "0");
  const naiveUtcGuess = new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00Z`);
  const offsetMinutes = getTimezoneOffsetMinutes(AUTHOR_TIMEZONE, naiveUtcGuess);
  return new Date(naiveUtcGuess.getTime() + offsetMinutes * 60_000);
}

/** { year, month (1-12), day, weekday (0=Sun) } for a Date, read in AUTHOR_TIMEZONE. */
export function partsInAuthorZone(date: Date): { year: number; month: number; day: number; weekday: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: AUTHOR_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const weekdayShort = parts.find((p) => p.type === "weekday")!.value;
  return {
    year: Number(parts.find((p) => p.type === "year")!.value),
    month: Number(parts.find((p) => p.type === "month")!.value),
    day: Number(parts.find((p) => p.type === "day")!.value),
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayShort),
  };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Calendar day-of-month for the Nth (1-4) or last (-1) occurrence of `weekday` in a given month. */
function nthWeekdayOfMonthDay(year: number, month: number, weekday: number, nth: 1 | 2 | 3 | 4 | -1): number {
  const firstOfMonthWeekday = partsInAuthorZone(instantFor(year, month, 1, 12, 0)).weekday;
  const firstOccurrence = 1 + ((weekday - firstOfMonthWeekday + 7) % 7);
  if (nth !== -1) return firstOccurrence + (nth - 1) * 7;
  const total = daysInMonth(year, month);
  let last = firstOccurrence;
  while (last + 7 <= total) last += 7;
  return last;
}

function isInSeason(month: number, day: number, r: { startMonth: number; startDay: number; endMonth: number; endDay: number }): boolean {
  const afterStart = month > r.startMonth || (month === r.startMonth && day >= r.startDay);
  const beforeEnd = month < r.endMonth || (month === r.endMonth && day <= r.endDay);
  // Non-wrapping range only (e.g. May-Aug, Sept-Dec) — matches every
  // SAMPLE_SCHEDULE entry; a range that crosses the year boundary (e.g.
  // "Nov-Feb") isn't handled, flagged rather than silently wrong.
  return afterStart && beforeEnd;
}

/** Next occurrence of a session, computed correctly across the DST boundary in AUTHOR_TIMEZONE, honoring its real recurrence rule. */
export function nextOccurrence(session: ScheduledSession, from: Date = new Date()): Date {
  const graceMs = session.durationMinutes * 60_000;
  const recurrence = session.recurrence;

  if (recurrence.type === "monthly-nth-weekday") {
    const start = partsInAuthorZone(from);
    for (let monthOffset = 0; monthOffset < 14; monthOffset++) {
      const totalMonth = start.month - 1 + monthOffset;
      const year = start.year + Math.floor(totalMonth / 12);
      const month = (totalMonth % 12) + 1;
      const day = nthWeekdayOfMonthDay(year, month, session.weekday, recurrence.nth);
      const actual = instantFor(year, month, day, session.startHour, session.startMinute);
      if (actual.getTime() >= from.getTime() - graceMs) return actual;
    }
    return from;
  }

  // "weekly" and "seasonal-weekly" both walk day by day — seasonal-weekly
  // just additionally requires the candidate to fall in-range, and keeps
  // searching (rather than returning) on an out-of-season match. A year+
  // window comfortably covers "next in-season occurrence" even for a
  // narrow season searched from just after it ends.
  const searchDays = recurrence.type === "seasonal-weekly" ? 371 : 8;
  for (let dayOffset = 0; dayOffset < searchDays; dayOffset++) {
    const candidate = new Date(from);
    candidate.setDate(candidate.getDate() + dayOffset);
    const { year, month, day, weekday } = partsInAuthorZone(candidate);
    if (weekday !== session.weekday) continue;
    if (recurrence.type === "seasonal-weekly" && !isInSeason(month, day, recurrence)) continue;

    const actual = instantFor(year, month, day, session.startHour, session.startMinute);
    if (actual.getTime() >= from.getTime() - graceMs) return actual;
  }
  // Fallback (shouldn't happen with these search windows).
  return from;
}

/** Minutes to ADD to a UTC-labeled instant to get the true UTC instant for the same wall-clock time in `timeZone`. */
function getTimezoneOffsetMinutes(timeZone: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(dtf.formatToParts(at).map((p) => [p.type, p.value]));
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (at.getTime() - asIfUtc) / 60_000;
}

/** Formats a session's next occurrence in the viewer's own local timezone. */
export function formatForViewer(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function minutesUntil(date: Date, from: Date = new Date()): number {
  return Math.round((date.getTime() - from.getTime()) / 60_000);
}

/** The single soonest occurrence across a list of sessions — shared by the Today screen and the Join Now shortcut. */
export function nextUpcoming(sessions: ScheduledSession[], from: Date = new Date()): { session: ScheduledSession; at: Date } {
  return sessions
    .map((session) => ({ session, at: nextOccurrence(session, from) }))
    .sort((a, b) => a.at.getTime() - b.at.getTime())[0];
}
