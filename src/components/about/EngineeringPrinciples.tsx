import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import { ABOUT_CONTENT } from "@/lib/about";

/**
 * Engineering principles as a numbered list (spec §10's "engineering
 * mindset"). Deliberately a stacked list with dividers, not a grid of
 * equal-sized cards — same anti-generic-card discipline spec §11 requires
 * for Services, applied here for visual consistency across the page.
 */
export function EngineeringPrinciples() {
  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {ABOUT_CONTENT.principles.map((principle, index) => (
        <Reveal key={principle.title} delayMs={index * 60}>
          <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8">
            <TechnicalLabel accent className="shrink-0 sm:w-12">
              {String(index + 1).padStart(2, "0")}
            </TechnicalLabel>
            <div>
              <h3 className="font-heading text-heading-md uppercase tracking-tight">
                {principle.title}
              </h3>
              <p className="mt-2 max-w-xl font-body text-body-md text-foreground-muted">
                {principle.description}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
