import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import type { Service } from "@/lib/schemas";

type ServicesListProps = {
  services: Service[];
};

/**
 * Services treated like vehicle capabilities (spec §11): a numbered,
 * full-width list — explicitly NOT generic equal-sized feature cards.
 * Capabilities render as an inline, dot-separated technical readout rather
 * than a bullet list or a set of pills, keeping the spec-table language
 * consistent with the rest of the site.
 */
export function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) return null;

  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {services.map((service, index) => (
        <Reveal key={service.id} delayMs={index * 60}>
          <div className="flex flex-col gap-3 py-8 sm:flex-row sm:gap-8">
            <TechnicalLabel accent className="shrink-0 sm:w-12">
              {service.id}
            </TechnicalLabel>
            <div>
              <h3 className="font-heading text-heading-md uppercase tracking-tight">
                {service.title}
              </h3>
              <p className="mt-2 max-w-xl font-body text-body-md text-foreground-muted">
                {service.description}
              </p>
              {service.capabilities.length > 0 ? (
                <p className="mt-4 font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted">
                  {service.capabilities.join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
