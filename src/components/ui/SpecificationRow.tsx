import { TechnicalLabel } from "./TechnicalLabel";

type SpecificationRowProps = {
  label: string;
  value: string;
};

/**
 * Automotive spec-table row: LABEL, a dotted leader line, then VALUE — see
 * spec §15 and DESIGN_SYSTEM.md's geometry language. Used by ProjectSpecs.
 *
 * The value intentionally does NOT use `shrink-0`: a long value (e.g. a
 * joined technologies list) needs to be able to shrink/wrap on narrow
 * viewports, or `flex-shrink: 0` forces it to render at its full
 * max-content width regardless of available space, overflowing the page.
 * Found via a real 375px-viewport audit in Milestone 11 — see
 * RESPONSIVE.md and DECISIONS.md D-021.
 */
export function SpecificationRow({ label, value }: SpecificationRowProps) {
  return (
    <div className="flex flex-wrap items-end gap-x-3 gap-y-1 py-2.5">
      <TechnicalLabel className="shrink-0">{label}</TechnicalLabel>
      <span aria-hidden="true" className="mb-1 min-w-[16px] flex-1 border-b border-dotted border-foreground-muted/30" />
      <span className="min-w-0 max-w-full font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-primary sm:shrink-0">
        {value}
      </span>
    </div>
  );
}
