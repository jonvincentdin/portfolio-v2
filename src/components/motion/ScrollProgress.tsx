"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getSection(pathname: string) {
  if (pathname.startsWith("/projects/")) {
    return NAV_ITEMS.find((item) => item.href === "/projects") ?? NAV_ITEMS[0];
  }

  return NAV_ITEMS.find((item) => item.href === pathname) ?? NAV_ITEMS[0];
}

/**
 * Passive telemetry-style page progress. It reads the document's natural
 * scroll position and never captures wheel, touch, keyboard, or anchor input.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const section = useMemo(() => getSection(pathname), [pathname]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollableHeight > 0 ? clamp(window.scrollY / scrollableHeight) : 0);
    };

    const scheduleUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname === "/owner" || pathname.startsWith("/editor")) return null;

  const percent = Math.round(progress * 100);

  return (
    <aside
      aria-label="Page scroll progress"
      className="pointer-events-none fixed right-4 bottom-4 z-20 flex items-center gap-3 bg-background-primary/80 px-3 py-2 backdrop-blur-sm sm:right-6 sm:bottom-6"
    >
      <span className="hidden font-technical text-[10px] uppercase tracking-[0.12em] text-foreground-muted sm:inline">
        Section {section.index}
      </span>
      <span className="relative h-px w-16 bg-border sm:w-28" aria-hidden="true">
        <span
          className="absolute inset-y-0 left-0 origin-left bg-accent"
          style={{ transform: `scaleX(${progress})`, width: "100%" }}
        />
      </span>
      <output className="min-w-[3ch] text-right font-technical text-[10px] uppercase tracking-[0.12em] text-accent">
        {percent}%
      </output>
    </aside>
  );
}
