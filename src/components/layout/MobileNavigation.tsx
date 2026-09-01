"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/navigation";
import { NavLink } from "./NavLink";

/**
 * Full-screen mobile menu (spec §7: "Do not create a generic drawer").
 * Foundation-level implementation uses simple CSS opacity/transform
 * transitions; full motion choreography and gesture polish land in
 * Milestone 12 per MOTION.md.
 */
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change. Adjusting state during render (rather than in an
  // effect) per React's "you might not need an effect" guidance — avoids an
  // extra render pass just to react to a prop-like change.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={cn(
            "block h-px w-6 bg-foreground-primary transition-transform duration-150",
            isOpen && "translate-y-[3.5px] rotate-45",
          )}
        />
        <span
          className={cn(
            "block h-px w-6 bg-foreground-primary transition-transform duration-150",
            isOpen && "-translate-y-[3.5px] -rotate-45",
          )}
        />
      </button>

      <div
        id="mobile-navigation"
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center bg-background-primary transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex flex-col items-start gap-8 px-8">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} className="text-2xl font-heading">
              <NavLink item={item} onClick={() => setIsOpen(false)} />
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
