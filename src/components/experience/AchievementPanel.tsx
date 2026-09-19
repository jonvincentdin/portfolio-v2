import { Reveal } from "@/components/motion/Reveal";
import type { Achievement } from "@/lib/schemas";
import { CredentialCard } from "./CredentialCard";

type AchievementPanelProps = {
  achievements: Achievement[];
};

/** Achievement gallery using the same readable, selectable credential surface. */
export function AchievementPanel({ achievements }: AchievementPanelProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {achievements.map((achievement, index) => (
        <Reveal key={achievement.id || achievement.title} delayMs={index * 60}>
          <CredentialCard
            kind="achievement"
            title={achievement.title}
            organization={achievement.organization}
            date={achievement.date}
            description={achievement.description}
            image={achievement.image}
          />
        </Reveal>
      ))}
    </div>
  );
}
