"use client";

import { useEffect, useState } from "react";

/**
 * Central `prefers-reduced-motion` hook (spec §49, MOTION.md). The global
 * CSS rule in globals.css already collapses all CSS transition/animation
 * durations to ~0 for anyone with the OS-level preference set — that alone
 * covers Reveal and every plain-CSS micro-interaction. This hook exists for
 * the cases the CSS rule can't reach: Framer Motion animations (which run
 * on JS-driven values, not CSS transitions) and any component that needs to
 * branch its *behavior* (e.g. skip a horizontal slide entirely, not just
 * speed it up) rather than just its duration.
 *
 * Implemented once, here, and consumed by every animated showroom
 * component — not re-implemented per component (MOTION.md).
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReduced(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
