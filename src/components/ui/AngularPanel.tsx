import { cn } from "@/lib/utils/cn";

type AngularPanelProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * "clip" cuts one corner for a technical, panel-like feel.
   * "outline" is a plain bordered surface with no clip (for content where
   * a clipped corner would interfere with padding/text).
   */
  variant?: "clip" | "outline";
  as?: "div" | "section" | "article";
};

const CLIP_PATH = "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)";

/**
 * Structural angular panel — clipped corner + thin border + surface fill.
 * The core building block for the site's "engineered" geometry language.
 * Used to frame the showroom image, spec blocks, and feature panels.
 * See DESIGN_SYSTEM.md §Geometry Language.
 */
export function AngularPanel({
  children,
  className,
  variant = "clip",
  as: Tag = "div",
}: AngularPanelProps) {
  return (
    <Tag
      className={cn("bg-surface border border-border", className)}
      style={variant === "clip" ? { clipPath: CLIP_PATH } : undefined}
    >
      {children}
    </Tag>
  );
}
