import { Reveal } from "@/components/motion/Reveal";
import type { SkillCategory as SkillCategoryData } from "@/lib/schemas";
import { SkillCategory } from "./SkillCategory";

type SkillDashboardProps = {
  categories: SkillCategoryData[];
};

/**
 * Skills as a telemetry-style dashboard (spec §25) — a grid of category
 * panels, each revealing in sequence rather than all at once (spec §41).
 * No generic pills, no fabricated percentages anywhere in this tree.
 */
export function SkillDashboard({ categories }: SkillDashboardProps) {
  if (categories.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {categories.map((category, index) => (
        <Reveal key={category.category} delayMs={index * 80}>
          <SkillCategory category={category} />
        </Reveal>
      ))}
    </div>
  );
}
