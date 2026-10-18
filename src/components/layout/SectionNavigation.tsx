"use client";

import { useEffect, useRef, useState } from "react";

type SectionLink = { id: string; label: string };

/** Native fragment links remain usable before hydration and preserve history. */
export function SectionNavigation({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = (navRef.current?.getBoundingClientRect().bottom ?? 140) + 24;
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= offset) current = section.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [sections]);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLAnchorElement>('[aria-current="location"]');
    if (!list || !link) return;
    const rail = list.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.left < rail.left) list.scrollLeft += item.left - rail.left;
    else if (item.right > rail.right) list.scrollLeft += item.right - rail.right;
  }, [active]);

  if (sections.length === 0) return null;

  return (
    <nav ref={navRef} aria-label="On this page" className="sticky top-16 z-20 my-8 border-y border-border bg-background-primary sm:top-20">
      <ul ref={listRef} className="flex gap-2 overflow-x-auto py-2">
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className={`motion-control inline-flex min-h-11 items-center border-b-2 px-3 font-technical text-technical-label uppercase tracking-[0.08em] ${active === section.id ? "border-accent text-accent" : "border-transparent text-foreground-muted hover:text-foreground-primary"}`}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
