"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { Certification } from "@/lib/schemas";
import { getCollectionMediaUrl } from "@/lib/content/media";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

/*
  No external CSS needed — uses inline styles and Tailwind.
*/

function HolographicCard({ cert, index }: { cert: Certification; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const cx = 0.5;
      const cy = 0.5;

      // Tilt (max 6°)
      const tiltX = ((y - cy) * -6).toFixed(2);
      const tiltY = ((x - cx) * 6).toFixed(2);
      const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;

      const el = cardRef.current;
      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      el.style.setProperty("--holo-x", `${(x * 100).toFixed(0)}%`);
      el.style.setProperty("--holo-y", `${(y * 100).toFixed(0)}%`);
      el.style.setProperty("--holo-angle", `${angle.toFixed(0)}deg`);
      el.style.setProperty("--holo-opacity", "1");
    },
    [prefersReducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    el.style.transform = "";
    el.style.setProperty("--holo-opacity", "0");
  }, []);

  const hasImage = !!cert.image;

  return (
    <Reveal delayMs={index * 80} className="h-full">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative flex flex-col h-full bg-surface border border-border p-6 overflow-hidden transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        style={
          {
            "--holo-x": "50%",
            "--holo-y": "50%",
            "--holo-angle": "180deg",
            "--holo-opacity": "0",
            transformStyle: "preserve-3d",
          } as React.CSSProperties
        }
      >
        {/* Holographic sheen overlay */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300 z-20"
          style={{
            opacity: "var(--holo-opacity)" as unknown as number,
            background: `
              radial-gradient(
                farthest-corner circle at var(--holo-x) var(--holo-y),
                rgba(255,255,255,0.6) 0%,
                transparent 60%
              ),
              conic-gradient(
                from var(--holo-angle) at var(--holo-x) var(--holo-y),
                #ff000040, #ff7f0040, #ffff0040, #00ff0040, #0000ff40, #4b008240, #9400d340, #ff000040
              )
            `,
          }}
        />

        {/* Foil border effect */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: "var(--holo-opacity)" as unknown as number,
            boxShadow: "inset 0 0 0 1px rgba(232,180,0,0.3)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Date */}
          <span className="font-technical text-technical-label text-accent uppercase tracking-[0.12em] mb-3">
            {cert.date}
          </span>

          {/* Title */}
          <h3 className="font-heading text-heading-sm sm:text-heading-md uppercase text-foreground-primary leading-tight line-clamp-2 mb-1">
            {cert.title}
          </h3>

          {/* Issuer */}
          <p className="font-body text-body-sm text-foreground-muted mb-4">
            {cert.issuer}
          </p>

          {/* Image */}
          {hasImage && (
            <div className="relative h-28 w-full border border-border bg-background-primary overflow-hidden my-auto">
              <Image
                src={getCollectionMediaUrl("certifications", cert.image!)}
                alt={cert.title}
                fill
                className="object-contain p-2"
              />
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Verify link */}
          {cert.credentialUrl && (
            <div className="mt-5 pt-4 border-t border-border">
              <ArrowLink href={cert.credentialUrl}>Verify</ArrowLink>
            </div>
          )}

          {/* Verified stamp */}
          {!cert.credentialUrl && (
            <div className="mt-5 pt-4 border-t border-border">
              <span className="font-technical text-[10px] uppercase tracking-[0.15em] text-accent/60">
                ✓ Verified
              </span>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function HolographicTemplate({
  certifications,
}: {
  certifications: Certification[];
}) {
  if (!certifications?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
      {certifications.map((cert, index) => (
        <HolographicCard key={cert.id} cert={cert} index={index} />
      ))}
    </div>
  );
}
