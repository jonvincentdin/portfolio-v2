import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
};

/**
 * Shared CTA link: filled accent block for the single strongest action on a
 * page ("primary"), thin underline + arrow for everything else
 * ("secondary") — see DESIGN_SYSTEM.md §Buttons & Interaction States.
 * Reused across Home, Contact, and later the showroom's "View Project".
 */
export function ArrowLink({
  href,
  children,
  variant = "secondary",
  external = false,
  className,
}: ArrowLinkProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center gap-3 font-technical text-technical-label uppercase tracking-[0.1em] transition-colors duration-150",
        isPrimary
          ? "bg-accent px-6 py-3 text-accent-foreground hover:bg-accent/90"
          : "border-b border-foreground-primary/30 pb-1 text-foreground-primary hover:border-accent hover:text-accent",
        className,
      )}
    >
      {children}
      <span className="inline-block transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
