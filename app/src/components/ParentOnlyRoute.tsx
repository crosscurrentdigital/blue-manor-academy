import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppMode } from "../context/AppModeContext";

/** Redirects to Today if a kid-mode device somehow navigates straight to a parent-only URL. */
export function ParentOnlyRoute({ children }: { children: ReactNode }) {
  const { mode } = useAppMode();
  if (mode === "kid") return <Navigate to="/" replace />;
  return <>{children}</>;
}
