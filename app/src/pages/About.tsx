import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import styles from "./About.module.css";

export function About() {
  return (
    <div className={styles.page}>
      <PageHeader title="About this preview" />

      <Surface padding="lg" className={styles.card}>
        <p>
          This is a working companion-app preview, built by <strong>Crucible Lab</strong> to scope a proposed
          mobile/installable app for Blue Manor Academy — not something Blue Manor Academy commissioned or has seen
          yet.
        </p>
        <p>
          <strong>What's real:</strong> the PWA install flow, the Web Push notification round trip (enable it on the
          Today tab and send yourself a test), the offline lesson-caching mechanic on the Library tab, and the
          timezone-correct schedule display on the Schedule tab.
        </p>
        <p>
          <strong>What's sample data, not live:</strong> the specific class/club days and times, the library
          content (a public-domain fable stands in for BMA's own copyrighted curriculum), and the Kids Teach Kids
          channels (entirely fictional placeholders — no real student content). The Zoom "Join" buttons point to
          Zoom's own public test-meeting page, not a real class.
        </p>
        <p>
          Blue Manor Academy already runs a real, professionally built platform — see the audit for why this is
          scoped as a companion app, not a rebuild.
        </p>
        <p className={styles.links}>
          <a href="/proposal/README.md">README</a> &middot; <a href="/proposal/AUDIT.md">Audit</a> &middot;{" "}
          <a href="/proposal/SCOPE.md">Scope</a> &middot; <a href="/proposal/PRICING.md">Pricing</a>
        </p>
        <p className={styles.contact}>Claton, Crucible Lab &middot; cbutcher@cruciblelab.org &middot; 605-939-5913</p>
      </Surface>
    </div>
  );
}
