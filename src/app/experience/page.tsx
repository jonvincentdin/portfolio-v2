import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { EducationTimeline } from "@/components/experience/EducationTimeline";
import { CertificationGallery } from "@/components/experience/CertificationGallery";
import { AchievementPanel } from "@/components/experience/AchievementPanel";
import { getAllExperience } from "@/lib/content/experience";
import { getAllEducation } from "@/lib/content/education";
import { getAllCertifications } from "@/lib/content/certifications";
import { getAllAchievements } from "@/lib/content/achievements";

export const metadata: Metadata = {
  title: "Experience",
};

/**
 * Experience + Education + Certifications + Achievements (spec §6, D-005)
 * on one coherent page. Each section is hidden entirely — heading included
 * — when its underlying content is empty (the pattern learned the hard way
 * in Milestone 07 and applied correctly from the start here).
 */
export default function ExperiencePage() {
  const experience = getAllExperience();
  const education = getAllEducation();
  const certifications = getAllCertifications();
  const achievements = getAllAchievements();

  return (
    <Container className="py-16 sm:py-24">
      <Reveal mode="mount">
        <TechnicalLabel accent as="div">
          04 / Experience
        </TechnicalLabel>
        <h1 className="mt-3 font-heading text-display-lg uppercase tracking-tight break-words sm:text-display-xl">
          Experience
        </h1>
      </Reveal>

      {experience.length > 0 ? (
        <div className="mt-16">
          <TechnicalLabel accent as="div" className="mb-8">
            Work History
          </TechnicalLabel>
          <ExperienceTimeline entries={experience} />
        </div>
      ) : null}

      {education.length > 0 ? (
        <div className="mt-16">
          <TechnicalLabel accent as="div" className="mb-6">
            Education
          </TechnicalLabel>
          <EducationTimeline entries={education} />
        </div>
      ) : null}

      {certifications.length > 0 ? (
        <div className="mt-16">
          <TechnicalLabel accent as="div" className="mb-6">
            Certifications
          </TechnicalLabel>
          <CertificationGallery certifications={certifications} />
        </div>
      ) : null}

      {achievements.length > 0 ? (
        <div className="mt-16">
          <TechnicalLabel accent as="div" className="mb-6">
            Achievements
          </TechnicalLabel>
          <AchievementPanel achievements={achievements} />
        </div>
      ) : null}
    </Container>
  );
}
