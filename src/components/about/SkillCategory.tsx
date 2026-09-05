import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import type { SkillCategory as SkillCategoryData } from "@/lib/schemas";
import { SkillItem } from "./SkillItem";

type SkillCategoryProps = {
  category: SkillCategoryData;
};

/**
 * One category as a clipped "telemetry panel" — matches the dashboard
 * concept from spec §25, using AngularPanel for the gauge-like framing
 * rather than a plain list with no structure.
 */
export function SkillCategory({ category }: SkillCategoryProps) {
  return (
    <AngularPanel className="p-6 sm:p-8">
      <TechnicalLabel accent as="div" className="mb-2">
        {category.category}
      </TechnicalLabel>
      <div className="divide-y divide-border/60">
        {category.skills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </div>
    </AngularPanel>
  );
}
