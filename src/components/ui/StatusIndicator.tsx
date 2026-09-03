import { cn } from "@/lib/utils/cn";
import { TechnicalLabel } from "./TechnicalLabel";

type StatusIndicatorProps = {
  label: string;
  className?: string;
  /** "active" gets the accent dot; "neutral" stays muted. */
  tone?: "active" | "neutral";
};

/** Small dot + technical label, used for availability/project status. */
export function StatusIndicator({ label, className, tone = "active" }: StatusIndicatorProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "active" ? "bg-accent" : "bg-foreground-muted",
        )}
      />
      <TechnicalLabel>{label}</TechnicalLabel>
    </div>
  );
}
