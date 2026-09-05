import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import type { Achievement } from "@/lib/schemas";

type AchievementPanelProps = {
  achievements: Achievement[];
};

/** Achievements as a grid of clipped panels, same language as CertificationGallery. */
export function AchievementPanel({ achievements }: AchievementPanelProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {achievements.map((achievement, index) => (
        <Reveal key={achievement.title} delayMs={index * 60}>
          <AngularPanel className="p-6">
            <TechnicalLabel accent as="div" className="mb-2">
              {achievement.date}
            </TechnicalLabel>
            <h3 className="font-heading text-heading-md uppercase tracking-tight">
              {achievement.title}
            </h3>
            <p className="mt-1 font-body text-body-md text-foreground-muted">
              {achievement.organization}
            </p>
            {achievement.description ? (
              <p className="mt-3 font-body text-body-md text-foreground-muted">
                {achievement.description}
              </p>
            ) : null}
          </AngularPanel>
        </Reveal>
      ))}
    </div>
  );
}
