import type { HTMLAttributes } from "react";
import styles from "./Surface.module.css";

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const padClass: Record<NonNullable<SurfaceProps["padding"]>, string> = {
  none: "padNone",
  sm: "padSm",
  md: "",
  lg: "padLg",
};

export function Surface({ raised = false, padding = "md", className, ...rest }: SurfaceProps) {
  const padKey = padClass[padding];
  const classes = [styles.surface, raised ? styles.raised : "", padKey ? styles[padKey] : "", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...rest} />;
}

export const Card = Surface;
