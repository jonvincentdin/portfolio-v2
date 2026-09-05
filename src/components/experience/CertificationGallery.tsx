import { AngularPanel } from "@/components/ui/AngularPanel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import type { Certification } from "@/lib/schemas";

type CertificationGalleryProps = {
  certifications: Certification[];
};

/**
 * Certifications as a grid of clipped panels — reuses the AngularPanel
 * "telemetry panel" language already established for Skills (Milestone 08)
 * rather than introducing generic rounded cards.
 */
export function CertificationGallery({ certifications }: CertificationGalleryProps) {
  if (certifications.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {certifications.map((cert, index) => (
        <Reveal key={cert.title} delayMs={index * 60}>
          <AngularPanel className="p-6">
            <TechnicalLabel accent as="div" className="mb-2">
              {cert.date}
            </TechnicalLabel>
            <h3 className="font-heading text-heading-md uppercase tracking-tight">{cert.title}</h3>
            <p className="mt-1 font-body text-body-md text-foreground-muted">{cert.issuer}</p>
            {cert.credentialId !== "" ? (
              <p className="mt-3 font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted">
                ID: {cert.credentialId}
              </p>
            ) : null}
            {cert.credentialUrl !== "" ? (
              <ArrowLink href={cert.credentialUrl} external className="mt-4">
                Verify
              </ArrowLink>
            ) : null}
          </AngularPanel>
        </Reveal>
      ))}
    </div>
  );
}
