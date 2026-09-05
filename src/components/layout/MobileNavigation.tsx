"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/navigation";
import { NavLink } from "./NavLink";

/**
 * Full-screen mobile menu (spec §7: "Do not create a generic drawer").
 * Foundation-level implementation uses simple CSS opacity/transform
 * transitions; full motion choreography and gesture polish land in
 * Milestone 12 per MOTION.md.
 *
 * The overlay is rendered via a portal into `document.body` rather than
 * inline where the component sits (inside `<header>`). `<header>` has
 * `backdrop-blur-sm` (a `backdrop-filter`), and per the CSS spec, an
 * element with a `filter`/`backdrop-filter`/`transform`/`perspective`
 * becomes the *containing block* for any `position: fixed` descendant.
 * With the overlay nested inside the header, its `fixed inset-0` was
 * resolving `top/right/bottom/left: 0` against the header's own ~64px-tall
 * box instead of the viewport — so the "full-screen" menu was actually
 * only ~64px tall, with its content simply overflowing visibly below that,
 * uncovered, into the page underneath. This was invisible in code review
 * and only surfaced through an actual browser click during the Milestone
 * 11 responsive audit — see DECISIONS.md D-021. The portal renders the
 * overlay directly under `<body>`, escaping the header's containing-block
 * entirely, which is the standard fix for this category of bug.
 */
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Standard, unavoidable "detect client mount" pattern: document.body
  // doesn't exist during SSR, and there's no way to know we're mounted
  // outside of an effect. Required for the portal below to be SSR-safe.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

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

  const overlay = (
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
  );

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

      {isMounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
