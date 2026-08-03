import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

// Replaces an earlier parent/kid "mode" design that defaulted to a parent
// view and required an explicit hand-off before a kid could reach the
// join-class experience — exactly the blocker flagged during review:
// signing up for classes is legitimately parent-only, but joining today's
// class shouldn't require passing through anything first.
//
// So there is no "mode" anymore. Today/Schedule/Library/Kids Teach Kids are
// simply always the app's default, ungated view — nothing to unlock, no
// hand-off ritual. Family (billing/progress) and About are the only
// PIN-gated pages, reached via the small "Parent tools" control in the
// header. Deliberately NOT persisted to localStorage: every fresh app open
// starts locked, so the very next class-time launch (from a push
// notification, from a home-screen tap, from any state the device was
// last left in) always lands straight on the kid-facing Today screen, not
// wherever a parent last left the parent tools open.

const PARENT_PIN = "1234"; // Demo-only placeholder — see AUDIT/SCOPE for the real per-family PIN this would become.

interface ParentAccessContextValue {
  unlocked: boolean;
  /** Returns false (stays locked) if the PIN is wrong. */
  unlock: (pin: string) => boolean;
  lock: () => void;
}

const ParentAccessContext = createContext<ParentAccessContextValue | null>(null);

export function ParentAccessProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  const value = useMemo<ParentAccessContextValue>(
    () => ({
      unlocked,
      unlock: (pin: string) => {
        if (pin !== PARENT_PIN) return false;
        setUnlocked(true);
        return true;
      },
      lock: () => setUnlocked(false),
    }),
    [unlocked],
  );

  return <ParentAccessContext.Provider value={value}>{children}</ParentAccessContext.Provider>;
}

export function useParentAccess(): ParentAccessContextValue {
  const ctx = useContext(ParentAccessContext);
  if (!ctx) throw new Error("useParentAccess must be used within a ParentAccessProvider");
  return ctx;
}
