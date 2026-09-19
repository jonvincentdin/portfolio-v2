"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import type { Education } from "@/lib/schemas";

type EducationTimelineProps = {
  entries: Education[];
};

/**
 * Education presented as a vertical left-aligned timeline — same visual
 * language as `ExperienceTimeline` for consistency. Each entry has a
 * square marker, date range, institution name, program, description,
 * and achievements.
 */
export function EducationTimeline({ entries }: EducationTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 65%"],
  });

  if (entries.length === 0) return null;

  return (
    <div ref={containerRef} aria-label="Education progression" className="relative pl-8">
      {/* Static background line */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-border" aria-hidden="true" />
      {/* Animated accent progress line */}
      <motion.div
        className="absolute top-0 left-0 h-full w-px origin-top bg-accent"
        style={{ scaleY: prefersReducedMotion ? 1 : scrollYProgress }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-12">
        {entries.map((entry) => (
          <Reveal key={entry.id}>
            <div className="relative">
              {/* Square marker on the line */}
              <span
                className="absolute top-1.5 -left-8 h-2 w-2 -translate-x-1/2 bg-accent"
                aria-hidden="true"
              />

              <TechnicalLabel accent as="div" className="mb-2">
                {entry.startYear} — {entry.endYear}
              </TechnicalLabel>

              <h3 className="font-heading text-heading-md uppercase tracking-tight">
                {entry.institution}
              </h3>
              <p className="mt-1 font-body text-body-md text-foreground-muted">
                {entry.program}
              </p>

              {entry.description ? (
                <p className="mt-3 max-w-2xl font-body text-body-md text-foreground-muted">
                  {entry.description}
                </p>
              ) : null}

              {entry.achievements.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-1.5">
                  {entry.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="max-w-2xl font-body text-body-md text-foreground-muted"
                    >
                      — {achievement}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
