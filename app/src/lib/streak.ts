// A real, device-tracked daily streak — not a sample number. Records
// today's date (in the visitor's own local timezone, since that's the
// day a family actually experiences) on every app load, and computes the
// current run of consecutive days including today. Distinct from
// Family.tsx's SAMPLE_CHILDREN streak numbers, which stay explicit
// sample/illustrative data (that page already discloses this) — this one
// is real, so it lives on the Today screen instead, where "real" and
// "sample" won't get confused sitting next to each other.

const STORAGE_KEY = "bma-visit-dates";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readDates(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeDates(dates: Set<string>): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...dates]));
}

/** Records a visit for today. Idempotent — safe to call on every app mount. */
export function recordVisitToday(): void {
  const dates = readDates();
  dates.add(todayKey());
  writeDates(dates);
}

/** Current consecutive-day streak including today, based on real recorded visits. */
export function getCurrentStreak(): number {
  const dates = readDates();
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (!dates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
