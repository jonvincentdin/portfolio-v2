"use client";

import type { Experience } from "@/lib/schemas";
import { Reveal } from "@/components/motion/Reveal";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

/*
  CSS classes used (defined in globals.css):
  .exp-scanlines, .exp-blinking-cursor, @keyframes exp-blink
*/

interface TerminalTemplateProps {
  entries: Experience[];
}

function formatMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function TerminalTemplate({ entries }: TerminalTemplateProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative w-full border border-border bg-[#0a0a0a] overflow-hidden font-technical text-body-sm sm:text-body-md">
      {/* ─── Window chrome ─── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-surface/60">
        <div className="flex gap-1.5">
          <span className="block h-2.5 w-2.5 border border-foreground-muted/40" />
          <span className="block h-2.5 w-2.5 border border-foreground-muted/40" />
          <span className="block h-2.5 w-2.5 border border-foreground-muted/40" />
        </div>
        <span className="text-foreground-muted text-technical-label tracking-wider">
          career@portfolio — zsh
        </span>
      </div>

      {/* ─── Terminal body ─── */}
      <div className="relative p-5 sm:p-8">
        <div className="absolute inset-0 exp-scanlines z-10" />

        <div className="relative z-20 space-y-10">
          {entries.map((entry, index) => {
            const isLast = index === entries.length - 1;
            const start = formatMonth(entry.startDate);
            const end = entry.current
              ? "PRESENT"
              : entry.endDate
                ? formatMonth(entry.endDate)
                : "—";

            return (
              <Reveal key={entry.id} delayMs={index * 100}>
                <div className="space-y-3">
                  {/* Command prompt */}
                  <p className="text-accent">
                    <span className="opacity-60">$</span>{" "}
                    ssh career@
                    <span className="text-foreground-primary">
                      {entry.company.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </p>

                  {/* Connection response */}
                  <p className="text-foreground-muted text-body-sm">
                    Connected to {entry.company}. Session active.
                  </p>

                  {/* Key-value output */}
                  <div className="ml-1 border-l border-accent/30 pl-4 space-y-0.5 text-body-sm sm:text-body-md">
                    <Row label="role" value={entry.position} accent />
                    <Row label="period" value={`${start} → ${end}`} />
                    <Row label="location" value={entry.location} />
                    <Row
                      label="status"
                      value={entry.current ? "● ACTIVE" : "○ COMPLETED"}
                      accent={entry.current}
                    />
                  </div>

                  {/* Responsibilities */}
                  {entry.responsibilities.length > 0 && (
                    <div className="ml-1 border-l border-border pl-4 space-y-1 text-body-sm">
                      {entry.responsibilities.map((r, i) => (
                        <p key={i} className="text-foreground-primary font-body">
                          <span className="text-accent/60 mr-2">›</span>
                          {r}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Tech stack */}
                  {entry.technologies && entry.technologies.length > 0 && (
                    <div className="ml-1 pl-4 pt-1">
                      <span className="text-foreground-muted text-body-sm">
                        {">"} stack:{" "}
                      </span>
                      <span className="text-accent text-body-sm uppercase tracking-wider">
                        {entry.technologies.join(" · ")}
                      </span>
                    </div>
                  )}

                  {/* Separator between sessions */}
                  {!isLast && (
                    <p className="text-foreground-muted/40 text-body-sm pt-2">
                      Connection closed.
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}

          {/* Blinking cursor on last entry */}
          {!prefersReducedMotion && (
            <div className="pt-2">
              <span className="text-accent">$</span>
              <span className="exp-blinking-cursor" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Internal row component ─── */

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <span className="text-foreground-muted/70 w-24 shrink-0">
        {">"} {label}:
      </span>
      <span
        className={`uppercase ${accent ? "text-accent" : "text-foreground-primary"}`}
      >
        {value}
      </span>
    </div>
  );
}
