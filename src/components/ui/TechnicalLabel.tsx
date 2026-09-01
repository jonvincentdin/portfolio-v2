import { cn } from "@/lib/utils/cn";

type TechnicalLabelProps = {
  children: React.ReactNode;
  className?: string;
  /** Renders with the accent color instead of the muted foreground. */
  accent?: boolean;
  as?: "span" | "div" | "p";
};

/**
 * Uppercase, letter-spaced, monospace label used for metadata throughout the
 * site (STACK / STATUS / YEAR / project counters, etc). See DESIGN_SYSTEM.md.
 */
export function TechnicalLabel({
  children,
  className,
  accent = false,
  as: Tag = "span",
}: TechnicalLabelProps) {
  return (
    <Tag
      className={cn(
        "font-technical text-technical-label uppercase tracking-[0.1em]",
        accent ? "text-accent" : "text-foreground-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
