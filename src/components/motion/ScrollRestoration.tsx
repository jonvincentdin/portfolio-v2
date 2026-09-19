"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Keeps new App Router entries at the top while leaving browser history and
 * same-page hash navigation to the browser. Next.js and the browser both
 * understand scroll restoration, but a persistent layout can otherwise keep
 * the previous page's scroll position during a client transition.
 */
export function ScrollRestoration() {
  const pathname = usePathname();
  const isInitialRender = useRef(true);
  const historyNavigationPathname = useRef<string | null>(null);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "auto";

    const markHistoryNavigation = () => {
      historyNavigationPathname.current = window.location.pathname;
    };

    window.addEventListener("popstate", markHistoryNavigation);
    return () => {
      window.removeEventListener("popstate", markHistoryNavigation);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (historyNavigationPathname.current === pathname) {
      historyNavigationPathname.current = null;
      return;
    }

    historyNavigationPathname.current = null;

    const frame = window.requestAnimationFrame(() => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
