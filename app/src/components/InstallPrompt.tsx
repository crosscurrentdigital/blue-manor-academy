import { Surface } from "./Surface";
import { Button } from "./Button";
import { usePwaInstall } from "../context/PwaInstallContext";
import styles from "./InstallPrompt.module.css";

/**
 * Install-to-home-screen banner — same two-variant pattern as the Piesano's
 * build (native beforeinstallprompt on Android/Chrome, manual "Add to Home
 * Screen" instructions on iOS Safari, which never fires that event).
 */
export function InstallPrompt() {
  const { visible, showIosInstructions, promptInstall, dismiss } = usePwaInstall();

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Install Blue Manor Academy Companion">
      <Surface raised padding="sm" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", width: "100%" }}>
        <div className={styles.body}>
          <p className={styles.title}>Add to home screen</p>
          {showIosInstructions ? (
            <p className={styles.text}>
              Tap the <strong>Share</strong> icon, then <strong>Add to Home Screen</strong> — one tap to join a live
              class next time.
            </p>
          ) : (
            <p className={styles.text}>Install the companion app for one-tap class join and lesson reminders.</p>
          )}
        </div>
        <div className={styles.actions}>
          {!showIosInstructions ? (
            <Button variant="primary" onClick={promptInstall}>
              Install
            </Button>
          ) : null}
          <button type="button" className={styles.dismiss} onClick={dismiss} aria-label="Dismiss">
            &times;
          </button>
        </div>
      </Surface>
    </div>
  );
}
