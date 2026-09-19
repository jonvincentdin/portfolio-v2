import { Reveal } from "@/components/motion/Reveal";
import type { Certification } from "@/lib/schemas";
import { CredentialCard } from "./CredentialCard";

type CertificationGalleryProps = {
  certifications: Certification[];
};

/** Credential gallery with controlled selection and optional managed imagery. */
export function CertificationGallery({ certifications }: CertificationGalleryProps) {
  if (certifications.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {certifications.map((cert, index) => (
        <Reveal key={cert.id || cert.title} delayMs={index * 60}>
          <CredentialCard
            kind="certification"
            title={cert.title}
            organization={cert.issuer}
            date={cert.date}
            credentialId={cert.credentialId}
            credentialUrl={cert.credentialUrl}
            image={cert.image}
          />
        </Reveal>
      ))}
    </div>
  );
}
