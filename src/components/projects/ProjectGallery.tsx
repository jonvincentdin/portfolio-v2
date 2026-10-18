import Image from "next/image";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";

type ProjectGalleryProps = {
  project: LoadedProject;
};

/**
 * Screenshot gallery from `media.gallery` (spec §14's SCREENSHOTS
 * section). Omitted entirely by the caller when `media.gallery` is empty
 * (spec §74) — this component assumes it only renders when there's
 * something to show.
 */
export function ProjectGallery({ project }: ProjectGalleryProps) {
  return (
    <div>
      <TechnicalLabel accent as="h2" className="mb-6">
        Screenshots
      </TechnicalLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {project.media.gallery.map((imagePath, index) => (
          <figure key={imagePath} className="min-w-0">
          <AngularPanel variant="outline" className="project-media-frame relative aspect-[16/10] overflow-hidden">
            <Image
              src={getProjectMediaUrl(project, imagePath)}
              alt={`${project.name} screenshot ${index + 1}`}
              fill
              sizes="(min-width: 640px) 45vw, 100vw"
              className="object-contain"
            />
          </AngularPanel>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-caption text-foreground-muted">
            <span>Screenshot {String(index + 1).padStart(2, "0")}</span>
            <a className="inline-flex min-h-11 items-center text-accent underline underline-offset-4" href={getProjectMediaUrl(project, imagePath)} aria-label={`Open ${project.name} screenshot ${index + 1} at full size`}>View full size</a>
          </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
