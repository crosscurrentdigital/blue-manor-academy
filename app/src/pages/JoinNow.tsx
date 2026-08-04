import { useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Button } from "../components/Button";
import styles from "./JoinNow.module.css";
import { DEMO_ZOOM_JOIN_URL, SAMPLE_SCHEDULE, formatForViewer, nextUpcoming } from "../lib/schedule";

// The real point of this page: a PWA manifest shortcut (long-press the
// installed app icon) can only point at a static URL — it can't itself
// know which class is next. This route is what makes "Join now" actually
// mean "join now" instead of "open the app to the Today screen and tap
// once more" — it computes the real next-upcoming session the same way
// the Today screen does (nextUpcoming, see lib/schedule.ts) and redirects
// straight to Zoom, no second tap. The short pause exists so the "Joining
// <title>" line is something a person can actually read, not a flash.
const REDIRECT_DELAY_MS = 900;

export function JoinNow() {
  const upcoming = nextUpcoming(SAMPLE_SCHEDULE);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = DEMO_ZOOM_JOIN_URL;
    }, REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Joining ${upcoming.session.title}…`}
        subtitle={`Real next-session lookup, launched from a home-screen shortcut — not a fixed link. Starts ${formatForViewer(upcoming.at)}.`}
      />
      <Surface padding="lg" className={styles.card}>
        <p>Opening Zoom now.</p>
        <a href={DEMO_ZOOM_JOIN_URL} className={styles.fallbackLink}>
          <Button variant="primary">Tap here if it doesn't open automatically</Button>
        </a>
      </Surface>
    </div>
  );
}
