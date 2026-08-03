import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const SESSION_SEEN_KEY = "bma-install-prompt-session-seen";
const DISMISSED_AT_KEY = "bma-install-prompt-dismissed-at";
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches;
}

export function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isOtherIosBrowser = /crios|fxios|edgios|opios/i.test(ua);
  const isSafari = /safari/i.test(ua) && !isOtherIosBrowser;
  return isIos && isSafari;
}

function readDismissedAt(): number | null {
  const raw = window.localStorage.getItem(DISMISSED_AT_KEY);
  if (!raw) return null;
  const dismissedAt = Number(raw);
  return Number.isNaN(dismissedAt) ? null : dismissedAt;
}

interface PwaInstallContextValue {
  beforeInstallPromptFired: boolean;
  eligible: boolean;
  showIosInstructions: boolean;
  visible: boolean;
  dismissedAt: number | null;
  cooldownActive: boolean;
  promptInstall: () => Promise<void>;
  dismiss: () => void;
}

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

/** Single source of truth for install-prompt state — same pattern as the Piesano's build. */
export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [beforeInstallPromptFired, setBeforeInstallPromptFired] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(() => readDismissedAt());

  useEffect(() => {
    if (isStandalone()) return;

    const alreadySeenThisSession = window.sessionStorage.getItem(SESSION_SEEN_KEY) === "true";
    if (!alreadySeenThisSession) {
      window.sessionStorage.setItem(SESSION_SEEN_KEY, "true");
      return;
    }

    const cooldownActive = dismissedAt !== null && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
    if (cooldownActive) return;

    setEligible(true);

    if (isIosSafari()) {
      setShowIosInstructions(true);
      setVisible(true);
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setBeforeInstallPromptFired(true);
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    const now = Date.now();
    window.localStorage.setItem(DISMISSED_AT_KEY, String(now));
    setDismissedAt(now);
    setVisible(false);
  }

  async function promptInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      dismiss();
    }
    setDeferredPrompt(null);
  }

  const cooldownActive = dismissedAt !== null && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;

  const value = useMemo<PwaInstallContextValue>(
    () => ({
      beforeInstallPromptFired,
      eligible,
      showIosInstructions,
      visible,
      dismissedAt,
      cooldownActive,
      promptInstall,
      dismiss,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [beforeInstallPromptFired, eligible, showIosInstructions, visible, dismissedAt, cooldownActive, deferredPrompt],
  );

  return <PwaInstallContext.Provider value={value}>{children}</PwaInstallContext.Provider>;
}

export function usePwaInstall(): PwaInstallContextValue {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) throw new Error("usePwaInstall must be used within a PwaInstallProvider");
  return ctx;
}
