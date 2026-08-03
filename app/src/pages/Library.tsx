import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import styles from "./Library.module.css";
import { clearProgress, getProgress, getSavedAt, setProgress } from "../lib/libraryProgress";
import { SAMPLE_LESSONS, type Lesson } from "../lib/libraryContent";

const CACHE_NAME = "bma-library-offline-v1";

function cacheKeyFor(lessonId: string): string {
  return `/library#${lessonId}`;
}

function LessonCard({ lesson, onOpen }: { lesson: Lesson; onOpen: () => void }) {
  const progress = getProgress(lesson.id);
  const hasProgress = progress !== null && progress < lesson.paragraphs.length - 1;
  const finished = progress !== null && progress >= lesson.paragraphs.length - 1;

  return (
    <Surface padding="md" className={styles.card}>
      <div className={styles.cardTop}>
        <h3 className={styles.cardTitle}>{lesson.title}</h3>
        {finished ? <Badge tone="success">Finished</Badge> : null}
        {hasProgress ? <Badge tone="gold">Paragraph {progress! + 1} of {lesson.paragraphs.length}</Badge> : null}
      </div>
      <p className={styles.cardSource}>{lesson.source}</p>
      <Button variant={hasProgress ? "primary" : "secondary"} onClick={onOpen}>
        {hasProgress ? "Continue where you left off" : finished ? "Read again" : "Start reading"}
      </Button>
    </Surface>
  );
}

export function Library() {
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [cached, setCached] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [, forceRerender] = useState(0);

  const openLesson = SAMPLE_LESSONS.find((l) => l.id === openLessonId) ?? null;

  useEffect(() => {
    if (openLesson) checkCached(openLesson.id);
  }, [openLessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkCached(lessonId: string) {
    if (!("caches" in window)) {
      setCached(false);
      return;
    }
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(cacheKeyFor(lessonId));
    setCached(Boolean(match));
  }

  async function saveForOffline(lesson: Lesson) {
    if (!("caches" in window)) return;
    setBusy(true);
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = new Response(JSON.stringify(lesson), { headers: { "content-type": "application/json" } });
      await cache.put(cacheKeyFor(lesson.id), response);
      setCached(true);
    } finally {
      setBusy(false);
    }
  }

  async function removeOffline(lesson: Lesson) {
    if (!("caches" in window)) return;
    setBusy(true);
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(cacheKeyFor(lesson.id));
      setCached(false);
    } finally {
      setBusy(false);
    }
  }

  function markPlace(lessonId: string, paragraphIndex: number) {
    setProgress(lessonId, paragraphIndex);
    forceRerender((n) => n + 1); // re-read progress for the card list underneath
  }

  if (!openLesson) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Library"
          subtitle="Self-paced reading, with a real 'resume where you left off' — the gap BMA's own Parent Library doesn't cover yet. Sample public-domain text below, standing in for BMA's own curriculum content."
        />
        <div className={styles.list}>
          {SAMPLE_LESSONS.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} onOpen={() => setOpenLessonId(lesson.id)} />
          ))}
        </div>
      </div>
    );
  }

  const savedParagraph = getProgress(openLesson.id);
  const savedAt = getSavedAt(openLesson.id);

  return (
    <div className={styles.page}>
      <Button variant="ghost" onClick={() => setOpenLessonId(null)}>
        &larr; Back to Library
      </Button>

      <Surface raised padding="lg">
        <div className={styles.topRow}>
          <div>
            <h2 className={styles.lessonTitle}>{openLesson.title}</h2>
            <p className={styles.lessonSource}>{openLesson.source}</p>
          </div>
          {cached === true ? <Badge tone="success">Saved for offline</Badge> : null}
        </div>

        {savedParagraph !== null ? (
          <p className={styles.resumeNote}>
            You left off at paragraph {savedParagraph + 1}
            {savedAt ? ` (saved ${new Date(savedAt).toLocaleString()})` : ""} — marked below.
          </p>
        ) : null}

        {openLesson.paragraphs.map((p, i) => (
          <div key={i} className={i === savedParagraph ? styles.paragraphRowMarked : styles.paragraphRow}>
            <p className={styles.paragraph}>{p}</p>
            <button
              type="button"
              className={styles.markButton}
              onClick={() => markPlace(openLesson.id, i)}
              aria-label={`Mark my place at paragraph ${i + 1}`}
            >
              {i === savedParagraph ? "📍 You stopped here" : "Mark my place here"}
            </button>
          </div>
        ))}
        <p className={styles.moral}>Moral: {openLesson.moral}</p>

        <div className={styles.actions}>
          {cached ? (
            <Button variant="secondary" onClick={() => removeOffline(openLesson)} disabled={busy}>
              Remove from offline storage
            </Button>
          ) : (
            <Button variant="primary" onClick={() => saveForOffline(openLesson)} disabled={busy || cached === null}>
              Save for offline
            </Button>
          )}
          {savedParagraph !== null ? (
            <Button
              variant="ghost"
              onClick={() => {
                clearProgress(openLesson.id);
                forceRerender((n) => n + 1);
              }}
            >
              Clear my saved place
            </Button>
          ) : null}
        </div>
        <p className={styles.hint}>
          Try it: click "Mark my place here" on any paragraph, go back to Library, then come back — it remembers
          exactly where you stopped, the same way across a browser refresh or a different day.
        </p>
      </Surface>
    </div>
  );
}
