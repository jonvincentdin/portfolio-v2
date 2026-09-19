"use client";

import { useId, useState } from "react";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import type { Education } from "@/lib/schemas";

type EducationTimelineProps = {
  entries: Education[];
};

/**
 * Education is presented as a keyboard-safe progression track rather than a
 * generic card grid. The same stage selector becomes a vertical journey on
 * narrow screens, while the selected details remain ordinary semantic text.
 */
export function EducationTimeline({ entries }: EducationTimelineProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const detailsId = useId();
  if (entries.length === 0) return null;

  const selected = entries[Math.min(selectedIndex, entries.length - 1)];
  const progress = entries.length <= 1 ? 100 : (selectedIndex / (entries.length - 1)) * 100;

  return (
    <div className="education-track" style={{ "--education-progress": `${progress}%` } as React.CSSProperties}>
      <div className="education-track__line" aria-hidden="true" />
      <div className="education-track__progress" aria-hidden="true" />

      <div role="tablist" aria-label="Education progression" className="relative grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {entries.map((entry, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={`${entry.id}-${entry.institution}-${index}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={detailsId}
              data-cursor="button"
              data-audio="ui-soft-click"
              onClick={() => setSelectedIndex(index)}
              className="motion-control group flex min-w-0 flex-col items-start gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:items-center sm:text-center"
            >
              <span className="education-track__node" aria-hidden="true" />
              <span className="font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted group-hover:text-foreground-primary group-aria-selected:text-accent">
                {String(index + 1).padStart(2, "0")} / {entry.endYear}
              </span>
              <span className="max-w-full truncate font-heading text-heading-sm uppercase tracking-tight group-aria-selected:text-accent">
                {entry.institution}
              </span>
            </button>
          );
        })}
      </div>

      <article id={detailsId} role="tabpanel" aria-live="polite" className="mt-10 border-t border-border pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div>
            <TechnicalLabel accent as="div">Selected stage / {String(selectedIndex + 1).padStart(2, "0")}</TechnicalLabel>
            <h3 className="mt-2 font-heading text-heading-md uppercase tracking-tight">{selected.institution}</h3>
            <p className="mt-1 font-body text-body-md text-foreground-muted">{selected.program}</p>
          </div>
          <TechnicalLabel className="shrink-0 sm:text-right">{selected.startYear} — {selected.endYear}</TechnicalLabel>
        </div>
        {selected.description ? <p className="mt-5 max-w-2xl font-body text-body-md text-foreground-muted">{selected.description}</p> : null}
        {selected.achievements.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {selected.achievements.map((achievement) => <li key={achievement} className="font-body text-body-md text-foreground-muted">— {achievement}</li>)}
          </ul>
        ) : null}
      </article>
    </div>
  );
}
