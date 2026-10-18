import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { ExperienceSectionRenderer } from "@/components/experience/ExperienceSectionRenderer";
import { getAllExperience } from "@/lib/content/experience";
import { getAllEducation } from "@/lib/content/education";
import { getAllCertifications } from "@/lib/content/certifications";
import { getAllAchievements } from "@/lib/content/achievements";
import { getSiteExperience } from "@/lib/content/editor";
import { DEFAULT_EXPERIENCE_SECTIONS } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Work history, education, certifications, and achievements.",
  openGraph: {
    title: "Experience",
    description: "Work history, education, certifications, and achievements.",
  },
};

/**
 * Experience page — renders configurable sections from siteExperience.
 * Each section picks a type (work-history, education, certifications,
 * achievements) and a visual template. Configured in the /editor.
 */
export default async function ExperiencePage() {
  const [experience, education, certifications, achievements, siteExperience] =
    await Promise.all([
      getAllExperience(),
      getAllEducation(),
      getAllCertifications(),
      getAllAchievements(),
      getSiteExperience(),
    ]);

  const sections = (
    siteExperience.experienceSections ?? DEFAULT_EXPERIENCE_SECTIONS
  ).filter((section) => section.visible !== false);

  const hasAnyData =
    experience.length > 0 ||
    education.length > 0 ||
    certifications.length > 0 ||
    achievements.length > 0;

  if (!hasAnyData) {
    return (
      <Container className="min-h-[60vh] py-16 sm:py-24">
        <SectionHeading kicker="04 / Experience" title="Experience" />
        <p className="mt-6 max-w-xl font-body text-body-md text-foreground-muted">
          No experience data has been added yet.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading kicker="04 / Experience" title="Experience" className="mb-16" />

      <div className="flex flex-col gap-16">
        {sections.map((section) => (
          <div key={section.id}>
            <TechnicalLabel accent as="h2" className="mb-8">
              {section.kicker ?? section.label}
            </TechnicalLabel>
            <ExperienceSectionRenderer
              section={section}
              experience={experience}
              education={education}
              certifications={certifications}
              achievements={achievements}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
