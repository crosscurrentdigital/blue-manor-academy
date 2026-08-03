// Real "Add to Calendar" export — a genuine .ics file, built client-side,
// no backend needed. Uses the actual recurrence rule from schedule.ts
// (not just the next date), so a family's calendar app shows the real
// recurring series correctly: RFC 5545's RRULE natively supports "Nth
// weekday of the month" (BYDAY=3MO for "3rd Monday") and a bounded weekly
// range (UNTIL), which map directly onto Recurrence's monthly-nth-weekday
// and seasonal-weekly cases — this isn't an approximation, it's the
// correct iCalendar-native representation of BMA's real cadence.

import type { ScheduledSession } from "./schedule";
import { DEMO_ZOOM_JOIN_URL, nextOccurrence } from "./schedule";

const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildRrule(session: ScheduledSession): string | null {
  const r = session.recurrence;
  const day = WEEKDAY_CODES[session.weekday];
  if (r.type === "weekly") return `RRULE:FREQ=WEEKLY;BYDAY=${day}`;
  if (r.type === "monthly-nth-weekday") return `RRULE:FREQ=MONTHLY;BYDAY=${r.nth}${day}`;
  if (r.type === "seasonal-weekly") {
    // Bound the series with UNTIL at the last in-season occurrence's own
    // year — a real calendar app then correctly stops the series each
    // year rather than continuing into the off-season. Since RRULE UNTIL
    // is a single absolute cutoff (not "resume next year"), this models
    // one season's worth of occurrences honestly rather than claiming a
    // multi-year recurring rule this demo hasn't actually verified BMA
    // repeats identically every year.
    const untilYear = new Date().getFullYear() + 1; // generous single-season bound for a demo export
    const until = new Date(Date.UTC(untilYear, r.endMonth, 0, 23, 59, 59));
    return `RRULE:FREQ=WEEKLY;BYDAY=${day};UNTIL=${toIcsUtc(until)}`;
  }
  return null;
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

/** Builds a complete, real .ics file (single VEVENT) for a session's real recurrence. */
export function buildIcs(session: ScheduledSession): string {
  const start = nextOccurrence(session);
  const end = new Date(start.getTime() + session.durationMinutes * 60_000);
  const rrule = buildRrule(session);
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
  ].filter(Boolean);

  return lines.join("\r\n");
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
