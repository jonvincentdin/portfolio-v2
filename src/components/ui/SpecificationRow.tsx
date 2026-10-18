import { TechnicalLabel } from "./TechnicalLabel";

type SpecificationRowProps = {
  label: string;
  value: string;
};

/** A build-sheet definition row: technical label, readable wrapping value. */
export function SpecificationRow({ label, value }: SpecificationRowProps) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-4 py-3">
      <dt><TechnicalLabel>{label}</TechnicalLabel></dt>
      <dd className="min-w-0 font-body text-caption text-foreground-primary [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  );
}
