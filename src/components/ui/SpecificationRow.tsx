import { TechnicalLabel } from "./TechnicalLabel";

type SpecificationRowProps = {
  label: string;
  value: string;
};

/**
 * Automotive spec-table row: LABEL, a dotted leader line, then VALUE — see
 * spec §15 and DESIGN_SYSTEM.md's geometry language. Used by ProjectSpecs.
 */
export function SpecificationRow({ label, value }: SpecificationRowProps) {
  return (
    <div className="flex items-end gap-3 py-2.5">
      <TechnicalLabel className="shrink-0">{label}</TechnicalLabel>
      <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-foreground-muted/30" />
      <span className="shrink-0 font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-primary">
        {value}
      </span>
    </div>
  );
}
