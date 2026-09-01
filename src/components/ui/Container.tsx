import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** "wide" spans further before max-width kicks in — used for the showroom. */
  size?: "default" | "wide";
};

/**
 * Shared responsive horizontal padding + max-width container. Every page
 * section wraps its content in this rather than repeating padding utilities
 * ad hoc, so the site's horizontal rhythm stays consistent across
 * breakpoints (see RESPONSIVE.md).
 */
export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        size === "wide" ? "max-w-[1600px]" : "max-w-[1280px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
