import Image from "next/image";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import type { ProjectFeature as ProjectFeatureData } from "@/lib/schemas";

type ProjectFeatureProps = {
  feature: ProjectFeatureData;
  index: number;
  project: LoadedProject;
};

/**
 * One entry in the case study's Features section (spec §16), alternating
 * left/right at desktop width. The image is optional per feature — when
 * absent, the text block simply spans full width.
 */
export function ProjectFeature({ feature, index, project }: ProjectFeatureProps) {
  const isReversed = index % 2 === 1;

  return (
    <Reveal>
      <div
        className={`flex flex-col gap-8 lg:items-center lg:gap-16 ${
          feature.image ? "lg:flex-row" : ""
        } ${isReversed ? "lg:flex-row-reverse" : ""}`}
      >
        <div className={feature.image ? "lg:flex-1" : "w-full"}>
          <TechnicalLabel accent as="div" className="mb-3">
            Feature {String(index + 1).padStart(2, "0")}
          </TechnicalLabel>
          <h3 className="font-heading text-heading-md uppercase tracking-tight">{feature.title}</h3>
          <p className="mt-4 max-w-xl font-body text-body-md text-foreground-muted">
            {feature.description}
          </p>
        </div>

        {feature.image ? (
          <AngularPanel className="relative aspect-[4/3] w-full overflow-hidden lg:flex-1">
            <Image
              src={getProjectMediaUrl(project, feature.image)}
              alt={feature.title}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </AngularPanel>
        ) : null}
      </div>
    </Reveal>
  );
}
