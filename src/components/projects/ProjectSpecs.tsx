import { SpecificationRow } from "@/components/ui/SpecificationRow";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import type { LoadedProject } from "@/lib/content";

type ProjectSpecsProps = {
  project: LoadedProject;
};

/**
 * Automotive-style specification table (spec §15). Every row maps to a
 * real Project schema field — ROLE/STACK/CATEGORY/STATUS/YEAR — nothing
 * fabricated (no ENGINE/TRANSMISSION-style placeholders that don't exist
 * on the actual data model).
 */
export function ProjectSpecs({ project }: ProjectSpecsProps) {
  return (
    <div>
      <TechnicalLabel accent className="mb-2 block">
        Project Specifications
      </TechnicalLabel>
      <div className="divide-y divide-border/60 border-t border-border">
        <SpecificationRow label="Role" value={project.role.join(", ")} />
        <SpecificationRow label="Stack" value={project.technologies.join(" / ")} />
        <SpecificationRow label="Category" value={project.category.join(", ")} />
        <SpecificationRow label="Status" value={project.status} />
        <SpecificationRow label="Year" value={String(project.year)} />
      </div>
    </div>
  );
}
