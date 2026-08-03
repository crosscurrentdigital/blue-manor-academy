import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import styles from "./Library.module.css";
import { clearProgress, getProgress, getSavedAt, setProgress } from "../lib/libraryProgress";

// Public-domain texts — Aesop's Fables — used deliberately instead of any of
// Blue Manor Academy's actual e-book curriculum, which is their paid,
// copyrighted product and not something to reproduce without a license.
// Three lessons (not one) specifically so "resume where you left off"
// across multiple books is something you can actually see working, not
// just a single-item toggle.
interface Lesson {
  id: string;
  title: string;
  source: string;
  paragraphs: string[];
  moral: string;
}

const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "tortoise-and-hare",
    title: "The Tortoise and the Hare",
    source: "Aesop's Fables (public domain)",
    paragraphs: [
      "A Hare was making fun of the Tortoise one day for being so slow.",
      '"Do you ever get anywhere?" he asked with a mocking laugh.',
      '"Yes," replied the Tortoise, "and I get there sooner than you think. I\'ll run you a race and prove it."',
      "The Hare, was much amused at the idea of running a race with the Tortoise, but for the fun of the thing he agreed. So the Fox, who had consented to act as judge, marked the distance and started the runners off.",
      "The Hare was soon far out of sight, and to make the Tortoise feel very deeply how ridiculous it was for him to try a race with a Hare, he lay down beside the course to take a nap until the Tortoise should catch up.",
      "The Tortoise meanwhile kept going slowly but steadily, and, after a time, passed the place where the Hare was sleeping. But the Hare slept on very peacefully; and when at last he did wake up, the Tortoise was near the goal. The Hare now ran his swiftest, but he could not overtake the Tortoise in time.",
    ],
    moral: "The race is not always to the swift.",
  },
  {
    id: "boy-who-cried-wolf",
    title: "The Shepherd Boy and the Wolf",
    source: "Aesop's Fables (public domain)",
    paragraphs: [
      "A Shepherd Boy tended his master's Sheep near a dark forest not far from the village. Soon he found life in the pasture very dull.",
      'He thought it would be great fun to fool the villagers by crying "Wolf! Wolf!" even though no wolf was in sight.',
      "The villagers came running, only to find the Boy laughing at the trick he had played on them.",
      '"Wolf! Wolf!" he cried again, and again the villagers ran to help, only to be laughed at once more.',
      "Then one day a Wolf did truly come. The Boy cried out in earnest, but the villagers, thinking it was another trick, did not come to help, and the Wolf had a good meal.",
    ],
    moral: "Nobody believes a liar, even when he is telling the truth.",
  },
  {
    id: "ant-and-grasshopper",
    title: "The Ant and the Grasshopper",
    source: "Aesop's Fables (public domain)",
    paragraphs: [
      "In a field one summer's day a Grasshopper was hopping about, chirping and singing to its heart's content.",
      "An Ant passed by, bearing along with great effort an ear of corn he was taking to the nest.",
      '"Why not come and chat with me," said the Grasshopper, "instead of toiling and moiling in that way?"',
      '"I am helping to lay up food for the winter," said the Ant, "and recommend you to do the same."',
      "When the winter came the Grasshopper had no food and found itself dying of hunger, while it saw the ants distributing every day corn from the stores they had collected in the summer.",
    ],
    moral: "It is best to prepare for the days of necessity.",
  },
];

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
