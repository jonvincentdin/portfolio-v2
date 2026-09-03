"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  /**
   * "mount": animates in as soon as the component mounts — used for
   * above-the-fold content (hero) as part of the page-load reveal
   * sequence (spec §29).
   * "scroll": animates in once the element enters the viewport — used for
   * below-the-fold sections (spec §38).
   */
  mode?: "mount" | "scroll";
};

/**
 * Shared entrance-animation wrapper. CSS-only transition (no Framer Motion —
 * see DECISIONS.md D-008, deferred until Milestone 05's showroom actually
 * needs AnimatePresence/layout animation). `prefers-reduced-motion` is
 * handled globally in globals.css, which collapses all transition/animation
 * durations to ~0, so no separate reduced-motion branch is needed here.
 */
export function Reveal({ children, className, delayMs = 0, mode = "scroll" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (mode === "mount") {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
