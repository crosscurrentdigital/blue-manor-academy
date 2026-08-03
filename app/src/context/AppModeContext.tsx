import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

// Parent/kid mode split — the concept borrowed from a sibling repo
// (WatchSafe) that solves a related problem: a single authenticated
// person (there, a parent) with a lightweight, PIN-gated "kid mode" layered
// on top, rather than a second real account. WatchSafe's version is wired
// to a Postgres users/sessions backend this demo doesn't have and doesn't
// need — what's portable is just the shape: a mode flag in local state,
// switching into kid mode requires no gate (a parent handing the device to
// a kid), switching back out requires a PIN. This demo's PIN is a fixed,
// publicly-known placeholder (see EXIT_PIN below) — fine for a sales
// preview, not something to ship as real access control.

export type AppMode = "parent" | "kid";

const STORAGE_KEY = "bma-app-mode";
const DEFAULT_MODE: AppMode = "parent";

// Demo-only. A real build would replace this with a real per-family PIN
// stored server-side, not a hardcoded value shipped in the client bundle.
export const EXIT_PIN = "1234";

function isAppMode(value: string | null): value is AppMode {
  return value === "parent" || value === "kid";
}

function readStoredMode(): AppMode {
  if (typeof window === "undefined") return DEFAULT_MODE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isAppMode(stored) ? stored : DEFAULT_MODE;
}

interface AppModeContextValue {
  mode: AppMode;
  enterKidMode: () => void;
  /** Returns false (and stays in kid mode) if the PIN is wrong. */
  exitKidMode: (pin: string) => boolean;
}

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>(readStoredMode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo<AppModeContextValue>(
    () => ({
      mode,
      enterKidMode: () => setMode("kid"),
      exitKidMode: (pin: string) => {
        if (pin !== EXIT_PIN) return false;
        setMode("parent");
        return true;
      },
    }),
    [mode],
  );

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>;
}

export function useAppMode(): AppModeContextValue {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error("useAppMode must be used within an AppModeProvider");
  return ctx;
}
