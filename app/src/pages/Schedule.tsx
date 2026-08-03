import { useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import styles from "./Schedule.module.css";
import { DEMO_ZOOM_JOIN_URL, SAMPLE_SCHEDULE, formatForViewer, nextOccurrence } from "../lib/schedule";
import { downloadIcs } from "../lib/ics";
import clubsImageUrl from "../assets/content/clubs.png";

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
        subtitle="A real enrolled family's actual Classes & Clubs schedule, seen directly. The countdown below actually implements each session's real recurrence — Nth-weekday-of-month, seasonal date ranges, or plain weekly — converted to your device's local time."
      />

      <img src={clubsImageUrl} alt="Coding Club, Chess Club, Crochet Club, Reading Club, Stock Market Club, Art Club, Manor Magazine, and more — Blue Manor Academy's full club offering" className={styles.clubsImage} />

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
              {session.realCadence ? <p className={styles.rowCadence}>Real cadence: {session.realCadence}</p> : null}
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
              <Button variant="ghost" onClick={() => downloadIcs(session)}>
                Add to Calendar
              </Button>
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}
