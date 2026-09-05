import { Reveal } from "@/components/motion/Reveal";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import type { Education } from "@/lib/schemas";

type EducationTimelineProps = {
  entries: Education[];
};

/**
 * Education history as a stacked, dividered list — consistent with the
 * row-list pattern used by EngineeringPrinciples/ServicesList elsewhere on
 * the site, rather than a second scroll-linked timeline (that treatment is
 * reserved for Experience, spec §42, as the page's primary content).
 */
export function EducationTimeline({ entries }: EducationTimelineProps) {
  if (entries.length === 0) return null;

  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {entries.map((entry, index) => (
        <Reveal key={entry.institution} delayMs={index * 60}>
          <div className="flex flex-col gap-2 py-6 sm:flex-row sm:justify-between sm:gap-8">
            <div>
              <h3 className="font-heading text-heading-md uppercase tracking-tight">
                {entry.institution}
              </h3>
              <p className="mt-1 font-body text-body-md text-foreground-muted">{entry.program}</p>
              {entry.description ? (
                <p className="mt-2 max-w-xl font-body text-body-md text-foreground-muted">
                  {entry.description}
                </p>
              ) : null}
              {entry.achievements.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-1">
                  {entry.achievements.map((achievement) => (
                    <li key={achievement} className="font-body text-body-md text-foreground-muted">
                      — {achievement}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <TechnicalLabel className="shrink-0 sm:text-right">
              {entry.startYear} – {entry.endYear}
            </TechnicalLabel>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
