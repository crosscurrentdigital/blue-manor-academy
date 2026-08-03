import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Layout.module.css";
import { PreviewBanner } from "./PreviewBanner";
import { ParentToolsButton } from "./ParentToolsButton";
import { useParentAccess } from "../context/ParentAccessContext";

const SHARED_LINKS = [
  { to: "/", label: "Today", end: true },
  { to: "/schedule", label: "Schedule", end: false },
  { to: "/library", label: "Library", end: false },
  { to: "/kids-teach-kids", label: "Kids Teach Kids", end: false },
];

// Family and the "about this preview" doc are the only parent-only pages —
// everything a kid needs to actually join class lives in SHARED_LINKS above
// with zero gate, per the fix here: joining class must never require
// unlocking anything first.
const PARENT_ONLY_LINKS = [
  { to: "/family", label: "Family", end: false },
  { to: "/about", label: "About this preview", end: false },
];

function navLinkClass(base: string, activeClass: string) {
  return ({ isActive }: { isActive: boolean }) => (isActive ? `${base} ${activeClass}` : base);
}

export interface LayoutProps {
  children: ReactNode;
}

/** Persistent header/nav + footer shell wrapping every route. */
export function Layout({ children }: LayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { unlocked } = useParentAccess();
  const navLinks = unlocked ? [...SHARED_LINKS, ...PARENT_ONLY_LINKS] : SHARED_LINKS;

  return (
    <div className={styles.shell}>
      <PreviewBanner />
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.crest} aria-hidden="true">
              BMA
            </span>
            <span className={styles.brandName}>Blue Manor Academy Companion</span>
          </NavLink>

          <nav className={styles.nav} aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navLinkClass(styles.navLink, styles.navLinkActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.headerRight}>
            <ParentToolsButton />
            <button
              type="button"
              className={styles.menuToggle}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {mobileNavOpen ? (
          <nav className={styles.mobileNav} aria-label="Primary mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navLinkClass(styles.mobileNavLink, styles.mobileNavLinkActive)}
                onClick={() => setMobileNavOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </div>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>Companion app preview for Blue Manor Academy &middot; built by Crucible Lab</p>
          <a href="/proposal/" className={styles.footerText} style={{ textDecoration: "underline" }}>
            Proposal &amp; scope docs
          </a>
        </div>
      </footer>
    </div>
  );
}
