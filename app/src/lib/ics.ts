// Real "Add to Calendar" export — a genuine .ics file, built client-side,
// no backend needed. Uses the actual recurrence rule from schedule.ts
// (not just the next date), so a family's calendar app shows the real
// recurring series correctly: RFC 5545's RRULE natively supports "Nth
// weekday of the month" (BYDAY=3MO for "3rd Monday") and a bounded weekly
// range (UNTIL), which map directly onto Recurrence's monthly-nth-weekday
// and seasonal-weekly cases — this isn't an approximation, it's the
// correct iCalendar-native representation of BMA's real cadence.

import type { ScheduledSession } from "./schedule";
import { DEMO_ZOOM_JOIN_URL, instantFor, nextOccurrence, partsInAuthorZone } from "./schedule";

const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

/**
 * `start`'s own season, bounded correctly. `UNTIL` alone can't stop a
 * WEEKLY rule at the off-season boundary — RRULE has no "resume next
 * year" concept, so without a month filter it just keeps firing every
 * week straight through to UNTIL, off-season included. BYMONTH is the
 * actual fix: it restricts occurrences to the in-season months, and
 * (since SAMPLE_SCHEDULE's seasons only ever start/end on the 1st/last
 * calendar day of a month — the only case isInSeason in schedule.ts
 * supports) that's an exact match, not an approximation. UNTIL still
 * bounds it to this one season's real end date, in the same year as
 * `start`, rather than claiming a multi-year rule this demo hasn't
 * verified BMA actually repeats identically every year.
 */
function buildSeasonalRrule(
  session: ScheduledSession,
  start: Date,
  r: { startMonth: number; endMonth: number; endDay: number },
): string {
  const day = WEEKDAY_CODES[session.weekday];
  const months: number[] = [];
  for (let m = r.startMonth; m <= r.endMonth; m++) months.push(m);
  const seasonYear = partsInAuthorZone(start).year;
  const until = instantFor(seasonYear, r.endMonth, r.endDay, 23, 59);
  return `RRULE:FREQ=WEEKLY;BYDAY=${day};BYMONTH=${months.join(",")};UNTIL=${toIcsUtc(until)}`;
}

function buildRrule(session: ScheduledSession, start: Date): string | null {
  const r = session.recurrence;
  const day = WEEKDAY_CODES[session.weekday];
  if (r.type === "weekly") return `RRULE:FREQ=WEEKLY;BYDAY=${day}`;
  if (r.type === "monthly-nth-weekday") return `RRULE:FREQ=MONTHLY;BYDAY=${r.nth}${day}`;
  if (r.type === "seasonal-weekly") return buildSeasonalRrule(session, start, r);
  return null;
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

/**
 * RFC 5545 §3.1 requires content lines to be folded at 75 octets, each
 * continuation line starting with a single leading space. Most modern
 * calendar apps tolerate long unfolded lines, but a strict parser won't —
 * folds by UTF-8 byte length (not JS string length), backing off from a
 * cut point that would land inside a multi-byte character (e.g. an em
 * dash), so a folded line never splits one character's bytes apart.
 */
function foldIcsLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    chunks.push(decoder.decode(bytes.slice(start, end)));
    start = end;
    limit = 74; // continuation lines carry one leading space, so 74 bytes of content + 1 space = 75
  }
  return chunks.join("\r\n ");
}

/** Builds a complete, real .ics file (single VEVENT) for a session's real recurrence. */
export function buildIcs(session: ScheduledSession): string {
  const start = nextOccurrence(session);
  const end = new Date(start.getTime() + session.durationMinutes * 60_000);
  const rrule = buildRrule(session, start);
  const uid = `${session.id}@bluemanor-academy-companion.demo`;

  const description = escapeIcsText(
    `${session.description} Sample event — Blue Manor Academy Companion demo (Crucible Lab). ` +
      `Real recurrence (${session.realCadence ?? "weekly"}), sample join link, not BMA's live data.`,
  );

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Blue Manor Academy Companion (demo)//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    rrule,
    `SUMMARY:${escapeIcsText(session.title)}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${escapeIcsText(DEMO_ZOOM_JOIN_URL)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return lines.map(foldIcsLine).join("\r\n");
}

/** Triggers a real .ics download for a session — no server round trip. */
export function downloadIcs(session: ScheduledSession): void {
  const blob = new Blob([buildIcs(session)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${session.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
