"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * Milestone 13 accessibility pass: the overlay is a real modal dialog
 * (`role="dialog"`, `aria-modal="true"`) with Escape-to-close, a focus
 * trap keeping Tab cycling within the menu's links while open, focus
 * moving to the first link on open, and focus returning to the trigger
 * button on close — none of which existed before (the menu worked for
 * mouse/touch users but not for keyboard-only or screen-reader users).
 */
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);

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

  // Focus management: move focus into the menu on open, back to the
  // trigger button on close. Escape closes it. A simple Tab-trap keeps
  // keyboard focus cycling within the menu's links while it's open,
  // since the rest of the page is meant to be inert while this is shown.
  useEffect(() => {
    if (isOpen) {
      firstLinkRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = navRef.current?.querySelectorAll<HTMLElement>("a");
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const overlay = (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-40 flex flex-col justify-center bg-background-primary transition-opacity duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <nav ref={navRef} aria-label="Mobile" className="flex flex-col items-start gap-8 px-8">
        {NAV_ITEMS.map((item, index) => (
          <div key={item.href} className="text-2xl font-heading">
            <NavLink
              item={item}
              onClick={() => setIsOpen(false)}
              linkRef={index === 0 ? firstLinkRef : undefined}
              tabIndex={isOpen ? 0 : -1}
            />
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 transition-transform duration-150 active:scale-90"
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
