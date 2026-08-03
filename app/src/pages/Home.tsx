import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import styles from "./Home.module.css";
import {
  DEMO_ZOOM_JOIN_URL,
  SAMPLE_SCHEDULE,
  formatForViewer,
  minutesUntil,
  nextOccurrence,
} from "../lib/schedule";
import { ensureWebPushSubscription, isIosInstallRequired } from "../lib/webpush";
import { fetchVapidKey, sendTestPush, subscribePush } from "../lib/pushApi";

const KIND_LABEL: Record<string, string> = { class: "Live class", club: "Club", mentorship: "Mentorship" };

export function Home() {
  const upcoming = useMemo(() => {
    return SAMPLE_SCHEDULE.map((session) => ({ session, at: nextOccurrence(session) })).sort(
      (a, b) => a.at.getTime() - b.at.getTime(),
    )[0];
  }, []);

  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [sending, setSending] = useState(false);
  const [pushMessage, setPushMessage] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if (isIosInstallRequired()) {
      setPushMessage("Add this app to your home screen first — iOS requires that before it can send reminders.");
    }
  }, []);

  async function handleEnableReminders() {
    setSubscribing(true);
    setPushMessage(null);
    try {
      const { key, transport } = await fetchVapidKey();
      if (!key) {
        setPushMessage("Push isn't configured on this deploy yet (no VAPID key set).");
        return;
      }
      const sub = await ensureWebPushSubscription(key);
      if (!sub) {
        setPushMessage("This browser/device doesn't support push, or needs the home-screen install step first.");
        return;
      }
      await subscribePush(sub.toJSON());
      setSubscription(sub);
      setSubscribed(true);
      setPushMessage(transport === "mock" ? "Subscribed (demo mode — no VAPID key set, so sends are simulated)." : "Subscribed — this device will receive real push notifications.");
    } catch (err) {
      setPushMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubscribing(false);
    }
  }

  async function handleSendTest() {
    if (!subscription) return;
    setSending(true);
    try {
      const { transport } = await sendTestPush(subscription.toJSON(), {
        title: `Reminder: ${upcoming.session.title}`,
        body: `Starts ${formatForViewer(upcoming.at)} — tap to join.`,
      });
      setPushMessage(
        transport === "web-push"
          ? "Real push sent — check this device's notifications."
          : "Test send simulated (demo mode — no VAPID key set on this deploy)."
      );
    } catch (err) {
      setPushMessage(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setSending(false);
    }
  }

  const minsUntil = minutesUntil(upcoming.at);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Today"
        subtitle="What's next — a live class or club, and today's lesson — one glance, one tap to join."
      />

      <Surface raised padding="lg" className={styles.heroCard}>
        <div className={styles.heroTop}>
          <Badge tone="accent">{KIND_LABEL[upcoming.session.kind]}</Badge>
          <Badge tone="neutral">{upcoming.session.ageRange}</Badge>
        </div>
        <h2 className={styles.heroTitle}>{upcoming.session.title}</h2>
        <p className={styles.heroWhen}>
          {formatForViewer(upcoming.at)}
          {minsUntil > 0 && minsUntil < 24 * 60 ? ` — in ${minsUntil < 60 ? `${minsUntil} min` : `${Math.round(minsUntil / 60)} hr`}` : null}
        </p>
        <p className={styles.heroDescription}>{upcoming.session.description}</p>
        <div className={styles.heroActions}>
          <a href={DEMO_ZOOM_JOIN_URL} target="_blank" rel="noreferrer" className={styles.joinLink}>
            <Button variant="primary">Join on Zoom</Button>
          </a>
          <Link to="/schedule">
            <Button variant="secondary">See full schedule</Button>
          </Link>
        </div>
      </Surface>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Class reminders</h3>
        <Surface padding="md">
          <p className={styles.pushCopy}>
            This is a real, working push notification — the same round trip proposed for BMA's live-class reminders,
            just pointed at a sample session instead of a real one.
          </p>
          <div className={styles.pushActions}>
            <Button variant="primary" onClick={handleEnableReminders} disabled={subscribing || subscribed}>
              {subscribed ? "Reminders enabled" : "Enable reminders on this device"}
            </Button>
            {subscribed ? (
              <Button variant="secondary" onClick={handleSendTest} disabled={sending}>
                Send me a test reminder now
              </Button>
            ) : null}
          </div>
          {pushMessage ? <p className={styles.pushMessage}>{pushMessage}</p> : null}
        </Surface>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Today's lesson</h3>
        <Surface padding="md">
          <p className={styles.pushCopy}>
            Self-paced reading, available for offline use — see the Library tab.
          </p>
          <Link to="/library">
            <Button variant="secondary">Open Library</Button>
          </Link>
        </Surface>
      </section>
    </div>
  );
}
