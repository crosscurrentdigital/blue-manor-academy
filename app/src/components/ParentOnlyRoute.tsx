import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useParentAccess } from "../context/ParentAccessContext";

/** Redirects to Today if parent tools aren't unlocked — a kid navigating straight to a parent URL lands back on the join/schedule view, not a dead end. */
export function ParentOnlyRoute({ children }: { children: ReactNode }) {
  const { unlocked } = useParentAccess();
  if (!unlocked) return <Navigate to="/" replace />;
  return <>{children}</>;
}
