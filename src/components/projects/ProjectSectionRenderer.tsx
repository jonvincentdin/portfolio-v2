import type { LoadedProject } from "@/lib/content/media";
import type { ProjectSection } from "@/lib/schemas";
import { ProjectShowroom } from "./ProjectShowroom";
import { CarouselTemplate } from "./templates/CarouselTemplate";
import { GridTemplate } from "./templates/GridTemplate";
import { TimelineTemplate } from "./templates/TimelineTemplate";
import { SpotlightTemplate } from "./templates/SpotlightTemplate";
import { FilmStripTemplate } from "./templates/FilmStripTemplate";

type ProjectSectionRendererProps = {
  section: ProjectSection;
  allProjects: LoadedProject[];
};

/**
 * Picks the correct layout template for a given ProjectSection and filters
 * the project list to only the slugs listed in `section.projectSlugs`
 * (or all projects if the list is empty / undefined).
 */
export function ProjectSectionRenderer({
  section,
  allProjects,
}: ProjectSectionRendererProps) {
  const projects =
    section.projectSlugs && section.projectSlugs.length > 0
      ? allProjects.filter((project) => section.projectSlugs!.includes(project.slug))
      : allProjects;

  if (projects.length === 0) return null;

  const props = { projects, label: section.label, kicker: section.kicker };

  switch (section.template) {
    case "showroom":
      return <ProjectShowroom projects={projects} kicker={section.kicker} label={section.label} />;
    case "carousel":
      return <CarouselTemplate {...props} />;
    case "grid":
      return <GridTemplate {...props} />;
    case "timeline":
      return <TimelineTemplate {...props} />;
    case "spotlight":
      return <SpotlightTemplate {...props} />;
    case "film-strip":
      return <FilmStripTemplate {...props} />;
    default:
      return <ProjectShowroom projects={projects} />;
  }
}

