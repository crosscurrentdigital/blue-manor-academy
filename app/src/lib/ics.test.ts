import { afterEach, describe, expect, it, vi } from "vitest";
import { buildIcs, buildIcsForSessions } from "./ics";
import { instantFor, SAMPLE_SCHEDULE, type Recurrence, type ScheduledSession } from "./schedule";

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

function rruleLine(ics: string): string | undefined {
  return ics.split("\r\n").find((l) => l.startsWith("RRULE"));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("buildIcs — RRULE per recurrence type", () => {
  it("weekly", () => {
    const s = session({ weekday: 2, recurrence: { type: "weekly" } });
    expect(rruleLine(buildIcs(s))).toBe("RRULE:FREQ=WEEKLY;BYDAY=TU");
  });

  it.each([
    [1, "RRULE:FREQ=MONTHLY;BYDAY=1MO"],
    [2, "RRULE:FREQ=MONTHLY;BYDAY=2MO"],
    [3, "RRULE:FREQ=MONTHLY;BYDAY=3MO"],
    [4, "RRULE:FREQ=MONTHLY;BYDAY=4MO"],
    [-1, "RRULE:FREQ=MONTHLY;BYDAY=-1MO"],
  ] as const)("monthly-nth-weekday nth=%d", (nth, expected) => {
    const s = session({ weekday: 1, recurrence: { type: "monthly-nth-weekday", nth } });
    expect(rruleLine(buildIcs(s))).toBe(expected);
  });

  // Regression test for the shipped bug: FREQ=WEEKLY;UNTIL alone recurs
  // every week straight through the off-season — BYMONTH is what actually
  // bounds it. System time is mocked so the season's year (and therefore
  // UNTIL) is deterministic regardless of when this suite runs.
  it("seasonal-weekly is bounded with BYMONTH and a same-year UNTIL — not just UNTIL", () => {
    vi.useFakeTimers();
    vi.setSystemTime(instantFor(2026, 8, 3, 9, 0)); // a Monday, before the season's next Tuesday
    const s = session({
      weekday: 2,
      recurrence: { type: "seasonal-weekly", startMonth: 5, startDay: 1, endMonth: 8, endDay: 31 },
    });
    expect(rruleLine(buildIcs(s))).toBe("RRULE:FREQ=WEEKLY;BYDAY=TU;BYMONTH=5,6,7,8;UNTIL=20260901T055900Z");
  });
});

describe("buildIcs — text escaping", () => {
  it("escapes commas, semicolons, backslashes, and newlines per RFC 5545", () => {
    const s = session({
      weekday: 0,
      recurrence: { type: "weekly" },
      title: "Field trip, RSVP; bring $5\\for snacks",
    });
    const ics = buildIcs(s);
    const summary = ics.split("\r\n").find((l) => l.startsWith("SUMMARY"));
    expect(summary).toBe("SUMMARY:Field trip\\, RSVP\\; bring $5\\\\for snacks");
  });
});

describe("buildIcs — RFC 5545 line folding", () => {
  it("folds long lines at 75 octets without splitting a multi-byte character", () => {
    // This exact filler length was chosen (see scratchpad verification) to
    // place the DESCRIPTION line's em dash exactly where a naive byte-75
    // cut would split it — a real regression case, not an arbitrary one.
    const s = session({
      weekday: 2,
      recurrence: { type: "weekly" },
      description: "x".repeat(47),
      realCadence: "May-Aug, Tuesday, 11 AM CST",
    });
    const ics = buildIcs(s);
    const lines = ics.split("\r\n");

    // Every physical line (as actually transmitted) must be <= 75 octets.
    for (const line of lines) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }

    // No line contains a replacement character — the tell-tale sign a
    // multi-byte character got split across a fold boundary.
    expect(lines.some((l) => l.includes("�"))).toBe(false);

    // Continuation lines start with exactly one leading space, and
    // unfolding (stripping "\r\n " between them) reconstructs the original
    // DESCRIPTION content byte-for-byte.
    const descIndex = lines.findIndex((l) => l.startsWith("DESCRIPTION:"));
    expect(descIndex).toBeGreaterThan(-1);
    let unfolded = lines[descIndex];
    let i = descIndex + 1;
    while (i < lines.length && lines[i].startsWith(" ")) {
      unfolded += lines[i].slice(1);
      i++;
    }
    expect(unfolded).toBe(
      "DESCRIPTION:" +
        "x".repeat(47) +
        " Sample event — Blue Manor Academy Companion demo (Crucible Lab). " +
        "Real recurrence (May-Aug\\, Tuesday\\, 11 AM CST)\\, sample join link\\, not BMA's live data.",
    );
  });
});

describe("buildIcs — UID", () => {
  it("uses the session id in a stable, namespaced UID", () => {
    const s = session({ id: "chess-club", weekday: 4, recurrence: { type: "weekly" } });
    const ics = buildIcs(s);
    const uid = ics.split("\r\n").find((l) => l.startsWith("UID"));
    expect(uid).toBe("UID:chess-club@bluemanor-academy-companion.demo");
  });
});

describe("buildIcsForSessions — bulk export", () => {
  it("bundles every real SAMPLE_SCHEDULE session into one VCALENDAR with no UID collisions", () => {
    const ics = buildIcsForSessions(SAMPLE_SCHEDULE);
    const lines = ics.split("\r\n");

    expect(lines.filter((l) => l === "BEGIN:VCALENDAR")).toHaveLength(1);
    expect(lines.filter((l) => l === "END:VCALENDAR")).toHaveLength(1);
    expect(lines.filter((l) => l === "BEGIN:VEVENT")).toHaveLength(SAMPLE_SCHEDULE.length);
    expect(lines.filter((l) => l === "END:VEVENT")).toHaveLength(SAMPLE_SCHEDULE.length);

    const uids = lines.filter((l) => l.startsWith("UID:"));
    expect(uids).toHaveLength(SAMPLE_SCHEDULE.length);
    expect(new Set(uids).size).toBe(SAMPLE_SCHEDULE.length); // no duplicates
    for (const s of SAMPLE_SCHEDULE) {
      expect(uids).toContain(`UID:${s.id}@bluemanor-academy-companion.demo`);
    }
  });

  it("single-session bulk export matches buildIcs's own output exactly", () => {
    // Fixed system time so DTSTAMP can't drift by a second between the two
    // independent calls below and produce a spurious mismatch.
    vi.useFakeTimers();
    vi.setSystemTime(instantFor(2026, 8, 3, 9, 0));
    const s = session({ id: "chess-club", weekday: 4, recurrence: { type: "weekly" } });
    expect(buildIcsForSessions([s])).toBe(buildIcs(s));
  });
});
