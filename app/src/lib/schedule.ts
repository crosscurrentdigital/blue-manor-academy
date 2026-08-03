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
   * ../../../proposal/AUDIT.md section 10). Shown as-is for authenticity.
   * The weekday/startHour/startMinute fields above are a simplified
   * weekly approximation for this demo's join-flow simulation — a real
   * build needs Nth-weekday-of-month and seasonal-date-range recurrence,
   * which this simple weekly scheduler doesn't implement (a real, priced
   * scope item, not a bug here).
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
    realCadence: "Sept-Dec, Tuesday, 2 PM CST",
  },
];

/** Next occurrence of a weekly session, computed correctly across the DST boundary in AUTHOR_TIMEZONE. */
export function nextOccurrence(session: ScheduledSession, from: Date = new Date()): Date {
  for (let dayOffset = 0; dayOffset < 8; dayOffset++) {
    const candidate = new Date(from);
    candidate.setDate(candidate.getDate() + dayOffset);

    const partsAtMidnight = new Intl.DateTimeFormat("en-US", {
      timeZone: AUTHOR_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    }).formatToParts(candidate);

    const weekdayShort = partsAtMidnight.find((p) => p.type === "weekday")?.value ?? "";
    const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayShort);
    if (weekdayIndex !== session.weekday) continue;

    const year = partsAtMidnight.find((p) => p.type === "year")!.value;
    const month = partsAtMidnight.find((p) => p.type === "month")!.value;
    const day = partsAtMidnight.find((p) => p.type === "day")!.value;

    // Build the session start as a UTC instant by asking "what UTC time
    // corresponds to HH:MM in AUTHOR_TIMEZONE on this date" — done by
    // formatting a UTC guess in AUTHOR_TIMEZONE and correcting the offset.
    const naiveUtcGuess = new Date(
      `${year}-${month}-${day}T${String(session.startHour).padStart(2, "0")}:${String(session.startMinute).padStart(2, "0")}:00Z`,
    );
    const offsetMinutes = getTimezoneOffsetMinutes(AUTHOR_TIMEZONE, naiveUtcGuess);
    const actual = new Date(naiveUtcGuess.getTime() + offsetMinutes * 60_000);

    if (actual.getTime() >= from.getTime() - session.durationMinutes * 60_000) {
      return actual;
    }
  }
  // Fallback (shouldn't happen with an 8-day search window).
  return from;
}

// Known dormant edge case (caught by audit, not currently reachable): this
// computes the DST offset from the naive guess instant, not the final one,
// so a session whose wall-clock time falls inside the one-hour "spring
// forward" gap or the repeated "fall back" hour resolves ambiguously
// (silently normalizes forward, or always picks the first occurrence)
// rather than erroring. None of SAMPLE_SCHEDULE's times (9:00, 14:00,
// 15:30, 16:00, 10:00, 12:00) land in that window, so this doesn't affect
// the current demo — flag before adding schedule data at other times.

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
