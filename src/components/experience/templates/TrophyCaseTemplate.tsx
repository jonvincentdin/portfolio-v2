"use client";

import { Achievement } from "@/lib/schemas";
import { getCollectionMediaUrl } from "@/lib/content/media";
import { Reveal } from "@/components/motion/Reveal";
import Image from "next/image";

/*
  CSS classes used (defined in globals.css):
  .exp-trophy-spotlight, .exp-trophy-shelf-glass, .exp-trophy-divider
*/

export function TrophyCaseTemplate({
  achievements,
}: {
  achievements: Achievement[];
}) {
  if (!achievements?.length) return null;

  return (
    <div className="w-full border border-border bg-[#0a0a0a] overflow-hidden">
      {/* Header shelf */}
      <div className="border-b border-border px-6 py-3 bg-surface/30">
        <span className="font-technical text-technical-label uppercase tracking-[0.15em] text-foreground-muted">
          Trophy case — {achievements.length} item
          {achievements.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Display grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, index) => {
          const imageUrl = achievement.image
            ? getCollectionMediaUrl("achievements", achievement.image)
            : null;

          // Add right border for non-last items in each row
          const isLastInRow2 = (index + 1) % 2 === 0;
          const isLastInRow3 = (index + 1) % 3 === 0;

          return (
            <Reveal
              key={achievement.id}
              delayMs={index * 60}
              className={`relative group border-b border-border ${
                !isLastInRow3 ? "lg:border-r" : ""
              } ${!isLastInRow2 ? "sm:border-r lg:border-r-0" : ""} ${
                isLastInRow3 ? "" : "lg:border-r"
              }`}
            >
              <div className="relative p-6 sm:p-8 flex flex-col items-center text-center min-h-[220px] justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Spotlight from above */}
                <div className="absolute inset-0 exp-trophy-spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                {/* Achievement icon/image */}
                {imageUrl ? (
                  <div className="relative w-14 h-14 mb-5 border border-border bg-surface overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 mb-5 border border-border bg-surface flex items-center justify-center">
                    <span className="text-accent font-heading text-heading-sm">
                      ◆
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="font-heading text-heading-sm uppercase text-foreground-primary leading-tight line-clamp-2 mb-2">
                  {achievement.title}
                </h3>

                {/* Organization */}
                <span className="font-technical text-[10px] uppercase tracking-[0.1em] text-foreground-muted">
                  {achievement.organization}
                </span>

                {/* Date */}
                <span className="font-technical text-[10px] uppercase tracking-[0.1em] text-accent mt-1">
                  {achievement.date}
                </span>

                {/* Glass shelf line */}
                <div className="absolute bottom-0 left-0 right-0 h-px exp-trophy-shelf-glass" />
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
