"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import type { Experience } from "@/lib/schemas";

type ExperienceTimelineProps = {
  entries: Experience[];
};

function formatMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(entry: Experience): string {
  const start = formatMonth(entry.startDate);
  if (entry.current) return `${start} — Present`;
  if (entry.endDate) return `${start} — ${formatMonth(entry.endDate)}`;
  return start;
}

/**
 * Work history as a timeline (spec §42): a vertical line that grows as the
 * user scrolls past it, with each entry revealing as it enters the
 * viewport (via the existing `Reveal` component, scroll mode). The line
 * growth uses Framer Motion's `useScroll` tied to this container specifically
 * — not the whole page — so it tracks the timeline's own scroll progress.
 * A small square marker (not a circle) keeps the angular, non-rounded
 * geometry language consistent with the rest of the site.
 */
export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 65%"],
  });

  if (entries.length === 0) return null;

  return (
    <div ref={containerRef} className="relative pl-8">
      <div className="absolute top-0 bottom-0 left-0 w-px bg-border" aria-hidden="true" />
      <motion.div
        className="absolute top-0 left-0 h-full w-px origin-top bg-accent"
        style={{ scaleY: prefersReducedMotion ? 1 : scrollYProgress }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-12">
        {entries.map((entry) => (
          <Reveal key={entry.id}>
            <div className="relative">
              <span
                className="absolute top-1.5 -left-8 h-2 w-2 -translate-x-1/2 bg-accent"
                aria-hidden="true"
              />

              <TechnicalLabel accent as="div" className="mb-2">
                {formatDateRange(entry)}
              </TechnicalLabel>

              <h3 className="font-heading text-heading-md uppercase tracking-tight">
                {entry.position}
              </h3>
              <p className="mt-1 font-body text-body-md text-foreground-muted">
                {entry.company} — {entry.location}
              </p>

              {entry.description ? (
                <p className="mt-3 max-w-2xl font-body text-body-md text-foreground-muted">
                  {entry.description}
                </p>
              ) : null}

              {entry.responsibilities.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-1.5">
                  {entry.responsibilities.map((item) => (
                    <li key={item} className="max-w-2xl font-body text-body-md text-foreground-muted">
                      — {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              {entry.technologies.length > 0 ? (
                <p className="mt-4 font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted">
                  {entry.technologies.join(" · ")}
                </p>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
