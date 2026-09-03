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
      <TechnicalLabel accent as="div" className="mb-6">
        Screenshots
      </TechnicalLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {project.media.gallery.map((imagePath) => (
          <AngularPanel key={imagePath} className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={getProjectMediaUrl(project, imagePath)}
              alt={`${project.name} screenshot`}
              fill
              sizes="(min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </AngularPanel>
        ))}
      </div>
    </div>
  );
}
