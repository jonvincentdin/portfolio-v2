# DECISIONS.md

Record of architectural/design decisions, each with the reasoning behind it.
Newest entries at the top.

---

## D-008 — Framer Motion installation deferred past Milestone 01
**Decision:** `framer-motion` is not yet installed. Milestone 01's
MobileNavigation uses plain CSS transitions instead.
**Reason:** Spec §28 explicitly scopes "premium/cinematic" motion to later
milestones (05, 12), and §75 favors avoiding unnecessary dependencies before
they're used. Installing it now with no real usage would add dead weight;
it will be added at the start of Milestone 05 when the showroom transitions
that actually require `AnimatePresence`/layout animation are built.

## D-007 — NavLink extracted as its own client component
**Decision:** Active-nav-state detection (`usePathname`) lives in a small
`NavLink` client component, not in `SiteHeader` itself.
**Reason:** ARCHITECTURE.md's server/client boundary rule calls for state and
hook usage to live in the smallest possible client boundary. `SiteHeader`
and `Footer` stay server components; only the few pixels of UI that actually
need the current pathname opt into being a client component. This wasn't in
the original COMPONENTS.md inventory and has been added there.

## D-006 — Spacing tokens implemented via Tailwind's default scale, not
custom CSS variables
**Decision:** The spec's spacing scale (4/8/12/16/24/32/48/64/96/128) is
satisfied directly by Tailwind v4's built-in spacing scale rather than
redeclaring a parallel set of `--spacing-*` tokens.
**Reason:** Tailwind's default 4px-based scale already produces exactly
those values at existing utility numbers (`p-1`→4px … `p-32`→128px);
duplicating them as custom tokens would create two competing systems for the
same numbers. Documented in DESIGN_SYSTEM.md and globals.css.

## D-005 — Route grouping for Experience-family sections
**Decision:** Experience, Education, Certifications, and Achievements share a
single `/experience` route rather than four separate routes.
**Reason:** Spec explicitly recommends this grouping (§6) to avoid
over-fragmenting the IA into ten thin pages; content is naturally chronological
and reads well as one coherent page.

## D-004 — ZIP streaming library
**Decision:** Use `archiver` for server-side ZIP generation, streamed rather
than buffered.
**Reason:** Spec explicitly warns against generating large archives fully in
browser memory (§63); `archiver` supports streaming writes directly to a
response and is a well-established Node solution for this.

## D-003 — Slug validation doubles as path-traversal defense
**Decision:** The download API and file-serving logic never accept a raw
filesystem path from the client; they only accept a `slug`, which is checked
against the closed set returned by `getAllProjects()` before any filesystem
access happens.
**Reason:** Spec explicitly requires preventing path traversal (§65) with a
concrete good/bad example; validating against a known set (rather than
sanitizing arbitrary input) is the more robust approach.

## D-002 — Content validated at build time, not just runtime
**Decision:** Zod validation of all `content/` JSON runs during
`generateStaticParams`/page data-fetching at build time, so invalid content
fails the build rather than shipping to production.
**Reason:** This is a mostly-static personal portfolio; failing fast at build
time is safer than surfacing a broken page to a visitor, and matches the
spec's testing requirements (§77) around meaningful errors for invalid data.

## D-001 — Single accent-color CSS variable, default racing yellow
**Decision:** Exactly one `--accent` variable drives all accent usage
sitewide; default value is racing yellow (`#E8B400`), easily swappable.
**Reason:** Spec explicitly requires accent colors be configurable and that
only one dominant accent appear at a time (§3).
