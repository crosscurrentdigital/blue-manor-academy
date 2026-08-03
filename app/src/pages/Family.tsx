import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { useAppMode } from "../context/AppModeContext";
import styles from "./Family.module.css";

// Sample multi-child progress data — illustrating the parent-side view a
// real build would populate from Blue Manor Academy's existing progress
// dashboard (already built by LaSoft, per AUDIT.md section 2). This app
// reads from that data, it doesn't replace it.
const SAMPLE_CHILDREN = [
  { name: "Jordan", grade: "4th grade", streakDays: 12, nextSession: "Art Club — Tue" },
  { name: "Riley", grade: "1st grade", streakDays: 5, nextSession: "Early Reader Class — Mon" },
];

export function Family() {
  const { enterKidMode } = useAppMode();

  return (
    <div className={styles.page}>
      <PageHeader
        title="Family"
        subtitle="Parent-only view — progress, plan, and a quick hand-off into kid mode. Sample data, standing in for BMA's real progress dashboard."
      />

      <div className={styles.grid}>
        {SAMPLE_CHILDREN.map((child) => (
          <Surface key={child.name} padding="md" className={styles.card}>
            <h3 className={styles.name}>{child.name}</h3>
            <p className={styles.grade}>{child.grade}</p>
            <div className={styles.badges}>
              <Badge tone="gold">{child.streakDays}-day streak</Badge>
            </div>
            <p className={styles.next}>Next: {child.nextSession}</p>
            <Button variant="secondary" onClick={enterKidMode}>
              Hand device to {child.name}
            </Button>
          </Surface>
        ))}
      </div>

      <Surface padding="md" className={styles.billing}>
        <h3 className={styles.billingTitle}>Plan &amp; billing</h3>
        <p className={styles.billingText}>
          Family plan — sample placeholder. A real build reads this from BMA's existing checkout/subscription system
          (also LaSoft-built) rather than duplicating it.
        </p>
      </Surface>
    </div>
  );
}
