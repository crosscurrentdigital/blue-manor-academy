// Sample weekly schedule. The class/club NAMES below are real — pulled from
// Blue Manor Academy's own public marketing (see ../../../proposal/AUDIT.md section 1
// and 5) — but the specific DAYS/TIMES are illustrative placeholders, not
// BMA's actual live schedule, since that data isn't public and this preview
// was built without access to their systems (see AUDIT.md's methodology
// note). Swapping this file for a real feed from BMA's API is the exact
// "we just need your credentials" step described in the proposal.
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
}

export const AUTHOR_TIMEZONE = "America/Denver";

// Zoom's own public test-meeting page — a real, working Zoom join flow,
// standing in for BMA's real per-class meeting link until API access is
// granted. Every session below points here on purpose, not to a different
// mock URL per class, so the demo never implies we have real meeting IDs.
export const DEMO_ZOOM_JOIN_URL = "https://zoom.us/test";

export const SAMPLE_SCHEDULE: ScheduledSession[] = [
  {
    id: "early-reader",
    title: "Early Reader Class",
    kind: "class",
    weekday: 1,
    startHour: 9,
    startMinute: 0,
    durationMinutes: 30,
    ageRange: "Ages 5-7",
    description: "Phonics and read-aloud practice in a small live group.",
  },
  {
    id: "art-club",
    title: "Art Club",
    kind: "club",
    weekday: 2,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 6-12",
    description: "Guided drawing and painting projects, live with other students.",
  },
  {
    id: "chess-club",
    title: "Chess Club",
    kind: "club",
    weekday: 3,
    startHour: 15,
    startMinute: 30,
    durationMinutes: 45,
    ageRange: "Ages 8-14",
    description: "Casual play and light instruction — bring your own board or play on-screen.",
    externalLink: { label: "Practice on ChessKid", url: "https://www.chesskid.com/" },
  },
  {
    id: "animation-club",
    title: "Animation Club",
    kind: "club",
    weekday: 4,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
    ageRange: "Ages 10-15",
    description: "Frame-by-frame animation basics, building toward a Kids-Teach-Kids submission.",
  },
  {
    id: "modeling-3d",
    title: "3D Modeling & Printing",
    kind: "class",
    weekday: 4,
    startHour: 16,
    startMinute: 0,
    durationMinutes: 60,
    ageRange: "Ages 12+",
    description: "Design-your-own projects, from CAD basics through a finished print file.",
  },
  {
    id: "read-aloud",
    title: "Read Aloud Club",
    kind: "club",
    weekday: 5,
    startHour: 10,
    startMinute: 0,
    durationMinutes: 30,
    ageRange: "All ages",
    description: "A rotating chapter book, read together live every week.",
  },
  {
    id: "parent-qa",
    title: "Parent Q&A",
    kind: "mentorship",
    weekday: 5,
    startHour: 12,
    startMinute: 0,
    durationMinutes: 30,
    ageRange: "Parents",
    description: "Open office hours — curriculum questions, pacing, anything homeschool-related.",
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
