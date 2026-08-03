import { PageHeader } from "../components/PageHeader";
import { Surface } from "../components/Surface";
import { Badge } from "../components/Badge";
import styles from "./KidsTeachKids.module.css";

// Entirely fictional placeholder channels — no real student names, videos,
// or thumbnails. Blue Manor Academy's actual Kids-Teach-Kids content is
// real children's video content and isn't something to reproduce or link
// to in a sales preview without their and their families' permission.
const SAMPLE_CHANNELS = [
  { initials: "JM", topic: "Origami", video: "Folding a paper crane, start to finish" },
  { initials: "AR", topic: "Chess openings", video: "Why I like the Italian Game" },
  { initials: "SK", topic: "Baking", video: "No-knead bread, kid-tested" },
  { initials: "TW", topic: "Space", video: "How I built a scale model of the solar system" },
];

export function KidsTeachKids() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Kids Teach Kids"
        subtitle="Placeholder channels — illustrating the concept, not real student content."
      />
      <div className={styles.grid}>
        {SAMPLE_CHANNELS.map((channel) => (
          <Surface key={channel.initials} padding="md" className={styles.card}>
            <div className={styles.thumb}>{channel.initials}</div>
            <Badge tone="neutral">{channel.topic}</Badge>
            <p className={styles.videoTitle}>{channel.video}</p>
          </Surface>
        ))}
      </div>
    </div>
  );
}
