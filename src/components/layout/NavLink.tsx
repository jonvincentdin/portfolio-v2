"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/lib/navigation";

/**
 * Determining the active route requires the current pathname, which is only
 * available via the `usePathname` client hook — this component exists
 * purely to keep that client boundary as small as possible, per
 * ARCHITECTURE.md's server/client boundary rule. SiteHeader and
 * MobileNavigation stay server/simple-client and delegate active-state
 * detection to this component.
 */
export function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group inline-flex items-center gap-2 font-technical text-technical-label uppercase tracking-[0.1em] transition-colors",
        isActive ? "text-foreground-primary" : "text-foreground-muted hover:text-foreground-primary",
      )}
    >
      <span className={cn(isActive ? "text-accent" : "text-foreground-muted/60")}>
        {item.index}
      </span>
      <span className="relative">
        {item.label}
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-px bg-current transition-all duration-150",
            isActive ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      </span>
    </Link>
  );
}
