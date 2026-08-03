import styles from "./PreviewBanner.module.css";

/**
 * Persistent, impossible-to-miss disclosure: this app reads from sample
 * data, not Blue Manor Academy's live systems. Exists specifically so this
 * preview can never be mistaken for evidence we accessed BMA's actual
 * platform without permission — see ../../../proposal/AUDIT.md's methodology
 * note and ../../../proposal/SCOPE.md section (f) on what this build deliberately does
 * not touch.
 */
export function PreviewBanner() {
  return (
    <div className={styles.banner} role="note">
      Preview built by Crucible Lab — schedule, curriculum, and
      Kids-Teach-Kids content on this page are illustrative samples, not
      Blue Manor Academy's live data. Zoom join links point to Zoom's own
      public test meeting, not a real class.
    </div>
  );
}
