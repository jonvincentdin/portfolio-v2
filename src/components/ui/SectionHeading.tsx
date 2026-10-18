import { cn } from "@/lib/utils/cn";
import { TechnicalLabel } from "./TechnicalLabel";

type SectionHeadingProps = {
  /** Short technical kicker above the heading, e.g. "02 / ABOUT". */
  kicker?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
  /** Optional id on the heading element, for aria-labelledby elsewhere. */
  headingId?: string;
  as?: "h1" | "h2";
};

/**
 * Standard section heading pattern: small accent kicker + large heading.
 * Used at the top of every major page section. See DESIGN_SYSTEM.md.
 */
export function SectionHeading({
  kicker,
  title,
  className,
  align = "left",
  headingId,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {kicker ? (
        <TechnicalLabel accent className="mb-3 block">
          {kicker}
        </TechnicalLabel>
      ) : null}
      <Heading
        id={headingId}
        className="font-heading text-heading-lg text-foreground-primary uppercase tracking-tight break-words sm:text-display-lg"
      >
        {title}
      </Heading>
    </div>
  );
}
