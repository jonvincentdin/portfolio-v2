"use client";

import { cn } from "@/lib/utils/cn";

type ProjectNavigationProps = {
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Previous/Next controls for the showroom (spec §1, §12). Elegant
 * automotive-inspired text controls — deliberately not literal steering
 * wheels or generic carousel arrow icons. Disabled entirely when there's
 * only one project (nothing to navigate to).
 */
export function ProjectNavigation({ onPrevious, onNext, disabled = false, className }: ProjectNavigationProps) {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={disabled}
        aria-label="Previous project"
        className="group inline-flex items-center gap-3 font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-primary transition-colors duration-150 hover:text-accent disabled:pointer-events-none disabled:opacity-30"
      >
        <span className="inline-block transition-transform duration-150 group-hover:-translate-x-1" aria-hidden="true">
          ←
        </span>
        Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        aria-label="Next project"
        className="group inline-flex items-center gap-3 font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-primary transition-colors duration-150 hover:text-accent disabled:pointer-events-none disabled:opacity-30"
      >
        Next
        <span className="inline-block transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </button>
    </div>
  );
}
