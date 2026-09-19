"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

type CarouselTemplateProps = {
  projects: LoadedProject[];
  label: string;
  kicker?: string;
};

/**
 * Horizontal snap-scroll carousel. Large 16:9 cards with a hover-reveal
 * overlay showing project name and tagline. Dot indicator below tracks the
 * active slide. Supports drag-to-scroll natively via CSS overflow + touch.
 */
export function CarouselTemplate({ projects, label, kicker }: CarouselTemplateProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(index)) setActiveSlide(index);
          }
        }
      },
      { root: track, threshold: 0.6 },
    );

    const slides = track.querySelectorAll(".project-carousel__slide");
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [projects.length]);

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  return (
    <section>
      {kicker || label ? (
        <div className="mb-8">
          {kicker ? <TechnicalLabel accent>{kicker}</TechnicalLabel> : null}
          <h2 className="mt-2 font-heading text-heading-lg uppercase tracking-tight">{label}</h2>
        </div>
      ) : null}

      <div className="project-carousel">
        <div ref={trackRef} className="project-carousel__track">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              data-index={index}
              className={cn("project-carousel__slide", "group")}
            >
              <div className="project-carousel__image">
                <Image
                  src={getProjectMediaUrl(project, project.media.hero)}
                  alt={project.name}
                  fill
                  sizes="min(480px, 88vw)"
                  className="object-cover transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
                <div className="project-carousel__overlay">
                  <div>
                    <p className="font-technical text-technical-label uppercase tracking-[0.1em] text-accent">
                      {project.year}
                    </p>
                    <p className="mt-1 font-heading text-heading-md uppercase text-white">
                      {project.name}
                    </p>
                    <p className="mt-1 font-body text-body-md text-white/70">{project.tagline}</p>
                  </div>
                </div>
              </div>
              <p
                className={cn(
                  "mt-3 font-technical text-technical-label uppercase tracking-[0.1em]",
                  index === activeSlide ? "text-accent" : "text-foreground-muted",
                )}
              >
                {project.name}
              </p>
            </Link>
          ))}
        </div>

        {projects.length > 1 ? (
          <div className="project-carousel__dots" role="tablist" aria-label="Go to slide">
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                role="tab"
                aria-selected={index === activeSlide}
                aria-label={`Go to ${project.name}`}
                onClick={() => scrollTo(index)}
                className="project-carousel__dot"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

