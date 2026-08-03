// Real "resume where you left off" tracking for the Library — built in
// direct response to a gap the client identified live: BMA's real Parent
// Library (books/videos/printables) doesn't track reading/viewing
// progress today, so a family has to remember their place manually.
// BMA said this is planned on their side; this is a genuinely working,
// small-scoped version of the same idea, client-side, no backend needed —
// not a claim that it replaces whatever BMA ends up shipping.

const STORAGE_KEY = "bma-library-progress";

interface ProgressMap {
  [lessonId: string]: { paragraphIndex: number; savedAt: string };
}

function readAll(): ProgressMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function getProgress(lessonId: string): number | null {
  const entry = readAll()[lessonId];
  return entry ? entry.paragraphIndex : null;
}

export function getSavedAt(lessonId: string): string | null {
  const entry = readAll()[lessonId];
  return entry ? entry.savedAt : null;
}

export function setProgress(lessonId: string, paragraphIndex: number): void {
  const all = readAll();
  all[lessonId] = { paragraphIndex, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage disabled/full on this device — the UI already reflects the
    // in-memory update for this session; just not persisted across reload.
  }
}

export function clearProgress(lessonId: string): void {
  const all = readAll();
  delete all[lessonId];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage disabled/full on this device — nothing further to do.
  }
}
