"use client";

import type { Experience, Education, Certification, Achievement, ExperienceSection } from "@/lib/schemas";

/* Existing templates */
import { ExperienceTimeline } from "./ExperienceTimeline";
import { EducationTimeline } from "./EducationTimeline";
import { CertificationGallery } from "./CertificationGallery";
import { AchievementPanel } from "./AchievementPanel";

/* New templates — Work History */
import { TerminalTemplate } from "./templates/TerminalTemplate";
import { DossierTemplate } from "./templates/DossierTemplate";
import { WorkHistoryOrbitTemplate } from "./templates/WorkHistoryOrbitTemplate";

/* New templates — Education */
import { BlueprintTemplate } from "./templates/BlueprintTemplate";
import { OrbitTemplate } from "./templates/OrbitTemplate";

import { HolographicTemplate } from "./templates/HolographicTemplate";
import { VaultTemplate } from "./templates/VaultTemplate";
import { MatrixTemplate } from "./templates/MatrixTemplate";

/* New templates — Achievements */
import { MissionLogTemplate } from "./templates/MissionLogTemplate";
import { TrophyCaseTemplate } from "./templates/TrophyCaseTemplate";

type ExperienceSectionRendererProps = {
  section: ExperienceSection;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
};

/**
 * Routes to the correct template based on section type + template selection.
 */
export function ExperienceSectionRenderer({
  section,
  experience,
  education,
  certifications,
  achievements,
}: ExperienceSectionRendererProps) {
  switch (section.type) {
    case "work-history": {
      if (experience.length === 0) return null;
      switch (section.template) {
        case "terminal":
          return <TerminalTemplate entries={experience} />;
        case "dossier":
          return <DossierTemplate entries={experience} />;
        case "orbit":
          return <WorkHistoryOrbitTemplate entries={experience} />;
        case "timeline":
        default:
          return <ExperienceTimeline entries={experience} />;
      }
    }
    case "education": {
      if (education.length === 0) return null;
      switch (section.template) {
        case "blueprint":
          return <BlueprintTemplate entries={education} />;
        case "orbit":
          return <OrbitTemplate entries={education} />;
        case "edu-timeline":
        default:
          return <EducationTimeline entries={education} />;
      }
    }
    case "certifications": {
      if (certifications.length === 0) return null;
      switch (section.template) {
        case "holographic":
          return <HolographicTemplate certifications={certifications} />;
        case "matrix":
          return <MatrixTemplate certifications={certifications} />;
        case "vault":
          return <VaultTemplate certifications={certifications} />;
        case "gallery":
        default:
          return <CertificationGallery certifications={certifications} />;
      }
    }
    case "achievements": {
      if (achievements.length === 0) return null;
      switch (section.template) {
        case "mission-log":
          return <MissionLogTemplate achievements={achievements} />;
        case "trophy-case":
          return <TrophyCaseTemplate achievements={achievements} />;
        case "panel":
        default:
          return <AchievementPanel achievements={achievements} />;
      }
    }
    default:
      return null;
  }
}

