import { useRegisterSW } from "virtual:pwa-register/react";
import { Surface } from "./Surface";
import { Button } from "./Button";
import styles from "./UpdateToast.module.css";

/** Service-worker lifecycle toast — pairs with registerType: 'prompt' in vite.config.ts. */
export function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const ONE_HOUR = 60 * 60 * 1000;
      window.setInterval(() => {
        registration.update().catch(() => {});
      }, ONE_HOUR);
    },
  });

  if (!needRefresh) return null;

  function refresh() {
    updateServiceWorker(true);
  }

  function dismiss() {
    setNeedRefresh(false);
  }

  return (
    <div className={styles.banner} role="status">
      <Surface raised padding="sm" className={styles.inner}>
        <p className={styles.text}>An update is available.</p>
        <Button variant="secondary" onClick={dismiss}>
          Later
        </Button>
        <Button variant="primary" onClick={refresh}>
          Refresh
        </Button>
      </Surface>
    </div>
  );
}
