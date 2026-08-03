import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import styles from "./Library.module.css";

// Public-domain text — Aesop's "The Tortoise and the Hare" — used deliberately
// instead of any of Blue Manor Academy's actual e-book curriculum, which is
// their paid, copyrighted product and not something to reproduce without a
// license. This stands in for "a self-paced literature lesson" to demonstrate
// the offline-caching mechanic honestly, not to imply it's BMA's real content.
const SAMPLE_LESSON = {
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
};

const CACHE_NAME = "bma-library-offline-v1";

export function Library() {
  const [cached, setCached] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    checkCached();
  }, []);

  async function checkCached() {
    if (!("caches" in window)) {
      setCached(false);
      return;
    }
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(window.location.pathname + "#lesson");
    setCached(Boolean(match));
  }

  async function saveForOffline() {
    if (!("caches" in window)) return;
    setBusy(true);
    try {
      const cache = await caches.open(CACHE_NAME);
      const body = JSON.stringify(SAMPLE_LESSON);
      const response = new Response(body, { headers: { "content-type": "application/json" } });
      await cache.put(window.location.pathname + "#lesson", response);
      setCached(true);
    } finally {
      setBusy(false);
    }
  }

  async function removeOffline() {
    if (!("caches" in window)) return;
    setBusy(true);
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(window.location.pathname + "#lesson");
      setCached(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Library"
        subtitle="Self-paced reading — no live connection required once saved. Sample text below (public domain), standing in for BMA's own curriculum content."
      />

      <Surface raised padding="lg">
        <div className={styles.topRow}>
          <div>
            <h2 className={styles.lessonTitle}>{SAMPLE_LESSON.title}</h2>
            <p className={styles.lessonSource}>{SAMPLE_LESSON.source}</p>
          </div>
          {cached === true ? <Badge tone="success">Saved for offline</Badge> : null}
        </div>

        {SAMPLE_LESSON.paragraphs.map((p, i) => (
          <p key={i} className={styles.paragraph}>
            {p}
          </p>
        ))}
        <p className={styles.moral}>Moral: {SAMPLE_LESSON.moral}</p>

        <div className={styles.actions}>
          {cached ? (
            <Button variant="secondary" onClick={removeOffline} disabled={busy}>
              Remove from offline storage
            </Button>
          ) : (
            <Button variant="primary" onClick={saveForOffline} disabled={busy || cached === null}>
              Save for offline
            </Button>
          )}
        </div>
        <p className={styles.hint}>
          Try it: save this page, then turn on airplane mode and reload — the lesson content is served from the
          service worker's cache, not the network.
        </p>
      </Surface>
    </div>
  );
}
