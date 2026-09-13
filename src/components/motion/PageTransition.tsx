"use client";

import { AnimatePresence } from "framer-motion";

type PageTransitionProps = {
  children: React.ReactNode;
};

/**
 * AnimatePresence wrapper, rendered once in the persistent root layout —
 * itself never unmounts across navigations. It exists purely to watch for
 * its child to unmount/remount so it can play an exit animation for the
 * outgoing page before the incoming one enters.
 *
 * The actual mount/unmount signal comes from `app/template.tsx`, not a
 * manually-tracked `key={pathname}` here. An earlier version of this
 * component used `usePathname()` as the key directly in the layout, but
 * `usePathname()` and Next's routed `children` both update in the same
 * render pass on navigation — so AnimatePresence never saw a genuine
 * "old element removed, new element added" transition, just one element
 * whose content silently changed underneath it. The result: the exit
 * animation played correctly (using the last-rendered content), but the
 * "new" page then rendered stuck at the exit's *final* frame forever,
 * since Framer Motion only replays the initial→animate sequence on a true
 * mount, not a prop update to an already-mounted instance. `template.tsx`
 * is Next.js's own documented mechanism for exactly this case: it creates
 * a genuinely new component instance on every navigation, which is what
 * `AnimatePresence` actually needs to detect the swap. See DECISIONS.md
 * D-026 — found and fixed via real-browser testing during Milestone 12,
 * not visible from code review of either file in isolation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
