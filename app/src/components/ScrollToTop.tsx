import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Plain BrowserRouter does no scroll restoration on its own — reset to top on every route change. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
