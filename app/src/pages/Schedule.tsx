import { useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import styles from "./Schedule.module.css";
import { DEMO_ZOOM_JOIN_URL, SAMPLE_SCHEDULE, formatForViewer, nextOccurrence } from "../lib/schedule";

const KIND_LABEL: Record<string, string> = { class: "Live class", club: "Club", mentorship: "Mentorship" };
const KIND_TONE: Record<string, "accent" | "gold" | "neutral"> = { class: "accent", club: "gold", mentorship: "neutral" };

export function Schedule() {
  const sessions = useMemo(
    () =>
      SAMPLE_SCHEDULE.map((session) => ({ session, at: nextOccurrence(session) })).sort(
        (a, b) => a.at.getTime() - b.at.getTime(),
      ),
    [],
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title="This week's schedule"
        subtitle="Real class and club names from Blue Manor Academy's own marketing — the day/time here is a sample, shown converted to your device's local time."
      />

      <div className={styles.list}>
        {sessions.map(({ session, at }) => (
          <Surface key={session.id} padding="md" className={styles.row}>
            <div className={styles.rowMain}>
              <div className={styles.rowTop}>
                <Badge tone={KIND_TONE[session.kind]}>{KIND_LABEL[session.kind]}</Badge>
                <Badge tone="neutral">{session.ageRange}</Badge>
              </div>
              <h3 className={styles.rowTitle}>{session.title}</h3>
              <p className={styles.rowWhen}>{formatForViewer(at)}</p>
              <p className={styles.rowDescription}>{session.description}</p>
            </div>
            <div className={styles.rowActions}>
              <a href={DEMO_ZOOM_JOIN_URL} target="_blank" rel="noreferrer" className={styles.rowJoin}>
                <Button variant="secondary">Join on Zoom</Button>
              </a>
              {session.externalLink ? (
                <a href={session.externalLink.url} target="_blank" rel="noreferrer" className={styles.rowJoin}>
                  <Button variant="ghost">{session.externalLink.label}</Button>
                </a>
              ) : null}
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}
