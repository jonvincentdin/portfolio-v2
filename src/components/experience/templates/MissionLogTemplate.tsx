"use client";

import { Achievement } from "@/lib/schemas";
import { getCollectionMediaUrl } from "@/lib/content/media";
import { Reveal } from "@/components/motion/Reveal";
import Image from "next/image";

/*
  CSS classes used (defined in globals.css):
  .exp-mission-log-scanline
*/

export function MissionLogTemplate({
  achievements,
}: {
  achievements: Achievement[];
}) {
  if (!achievements?.length) return null;

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0a] border border-border">
      {/* Scanline overlay */}
      <div className="absolute inset-0 exp-mission-log-scanline z-0" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center gap-3 border-b border-border bg-surface/40 px-6 py-3">
        <span className="h-2 w-2 bg-accent" />
        <span className="font-technical text-technical-label uppercase tracking-[0.15em] text-accent">
          Mission control // Achievement log
        </span>
      </div>

      {/* Mission entries */}
      <div className="relative z-10 divide-y divide-border">
        {achievements.map((achievement, index) => {
          const num = String(index + 1).padStart(3, "0");
          const imageUrl = achievement.image
            ? getCollectionMediaUrl("achievements", achievement.image)
            : null;

          return (
            <Reveal key={achievement.id} delayMs={index * 80}>
              <div className="group flex gap-6 px-6 py-6 sm:py-8 transition-colors hover:bg-surface/30">
                {/* Mission number column */}
                <div className="hidden sm:flex flex-col items-center shrink-0 w-16">
                  <span className="font-technical text-[10px] tracking-[0.15em] text-foreground-muted/60 uppercase">
                    MSN
                  </span>
                  <span className="font-heading text-heading-lg text-foreground-primary leading-none mt-1">
                    {num}
                  </span>
                  {/* Vertical connector */}
                  {index < achievements.length - 1 && (
                    <div className="mt-3 flex-1 w-px border-l border-dashed border-border-strong" />
                  )}
                </div>

                {/* Mission details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-4 mb-3">
                    {/* Thumbnail */}
                    {imageUrl && (
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 border border-border bg-surface overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={achievement.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="font-heading text-heading-sm sm:text-heading-md uppercase text-foreground-primary leading-tight">
                        {achievement.title}
                      </h3>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <span className="inline-flex items-center gap-1.5 font-technical text-[10px] uppercase tracking-[0.1em] text-accent bg-accent/10 border border-accent/30 px-2 py-0.5">
                          <span className="h-1 w-1 bg-accent" />
                          Complete
                        </span>
                        <span className="font-technical text-technical-label text-foreground-muted uppercase">
                          {achievement.date}
                        </span>
                        <span className="font-technical text-technical-label text-foreground-muted/70 uppercase">
                          CMD: {achievement.organization}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {achievement.description && (
                    <p className="font-body text-body-sm text-foreground-muted mt-3 leading-relaxed max-w-2xl">
                      {achievement.description}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
