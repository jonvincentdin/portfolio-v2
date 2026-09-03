# DECISIONS.md

Record of architectural/design decisions, each with the reasoning behind it.
Newest entries at the top.

---

## D-016 — Individual file downloads whitelisted against `files[]`, not just path-validated
**Decision:** `/api/projects/[slug]/files/[...path]` only serves a request
if the requested relative path exactly matches one of the project's own
`files[].path` entries — not merely "any file that resolves inside the
project directory."
**Reason:** Generic path-traversal prevention (resolved-path containment)
would still let someone download `hero.webp` or `thumbnail.webp` — files
that exist in the folder but were never declared as downloadable content.
Matching against the explicit `files[]` list is both stricter and more
correct: it reflects the author's actual intent (only these files are
meant to be individually downloadable) while the separate "Download
Project" ZIP action remains the way to get everything, files[]-listed or
not. Verified: requesting `hero.webp` through the files route 404s even
though it's a real, existing file in the project folder.

## D-015 — `archiver` v8's class-based API, not the classic factory function
**Decision:** The ZIP download route uses `new ZipArchive({...})` from
`archiver` v8, not the `archiver('zip', options)` factory-function call
DECISIONS.md D-004 originally described (which matches older `archiver`
majors, v5–v7).
**Reason:** Discovered as a real TypeScript build failure, not a docs typo:
the installed `archiver@8.0.0` ships an ESM, class-based API
(`Archiver`/`ZipArchive`/`TarArchive`/`JsonArchive`), and `@types/archiver@8`
matches that shape exactly (no callable default export). `finalize()` also
now returns a `Promise<void>` rather than being synchronous — it's called
without `await` (so it runs concurrently with the response body being
streamed) but with a `.catch()` so a finalize failure is logged instead of
becoming an unhandled rejection. Verified end-to-end: downloaded ZIPs for
both a full project (with a `files/` subfolder) and a lean project (no
`files/` subfolder) and confirmed with `unzip -l` that the folder structure
is preserved correctly under a top-level `<folderName>/` entry in both
cases.

## D-014 — `framer-motion` installed at Milestone 05, drag-based swipe reuses the same variant system
**Decision:** `framer-motion` was installed at the start of Milestone 05 (per
D-008's plan). The showroom's directional transitions (spec §32), animated
counter (spec §34), and thumbnail active-indicator motion (spec §33) all
use it. Touch/swipe is implemented via the same `motion.div` that already
carries the enter/exit variants (`drag="x"`, `dragConstraints={{left:0,
right:0}}`, `onDragEnd` checking offset/velocity thresholds), rather than a
separate gesture layer.
**Reason:** A separate swipe-detection layer (e.g. raw touch event
listeners) would duplicate the direction/index logic already owned by
`ProjectShowroom`. Framer Motion's `drag` prop composes naturally with its
own `variants` system on the same element — the card temporarily tracks the
pointer during a drag, then resumes normal variant-driven animation once the
gesture ends (either snapping back via `dragConstraints`, or unmounting via
`AnimatePresence` if the drag crossed the threshold and triggered a real
index change). Verified via an isolated Node script exercising the exact
threshold logic (small drag → snap back; large drag or fast flick in either
direction → correct next/previous) rather than only reading the code.

## D-013 — Showroom navigation wraps around
**Decision:** `ProjectShowroom`'s next/previous navigation wraps (last →
first, first → last) rather than stopping at either end.
**Reason:** A continuous, endless-browsing feel fits the "digital showroom"
concept better than a dead-ending carousel; disabling prev/next only
happens when there's just one project (nothing to navigate to at all).

## D-012 — `getProjectMediaUrl` isolated in its own Node-free module
**Decision:** `getProjectMediaUrl` was moved out of `projects.ts` into a
standalone `src/lib/content/media.ts` that imports nothing from `node:fs`/
`node:path`; client components import it from `@/lib/content/media`
directly, not the `@/lib/content` barrel.
**Reason:** Discovered as a real build failure, not a hypothetical: any
client component that imported `getProjectMediaUrl` from `projects.ts` (or
the barrel, which re-exports it) pulled that module's top-level
`node:fs`/`node:path` imports into the browser bundle, which crashed
Turbopack outright ("the chunking context does not support external
modules"). Isolating the one pure, client-safe function into its own module
— and having client components import it directly rather than through the
barrel — fixes this permanently rather than papering over one call site.
Verified: `next build` succeeds and the showroom renders correctly with
real project images after the fix.

## D-011 — Site identity and social links centralized as plain constants
**Decision:** `src/lib/site.ts` (name, role, hero copy, location,
specialization, status) and `src/lib/social.ts` (GitHub/LinkedIn/email)
hold personal/site metadata as plain TypeScript constants, not JSON content.
`SiteHeader` and `Footer` were both updated to consume these rather than
each hard-coding their own copy.
**Reason:** This information doesn't fit any of the seven defined content
types in CONTENT_SYSTEM.md (it's not a project, experience entry, etc.), but
duplicating "Your Name" and the social link list across Home and Footer
separately would immediately drift. A single typed source is simpler than
inventing an eighth content type for what's fundamentally site
configuration, not filesystem-authored/discoverable content.

## D-010 — Content media served via a dedicated, image-only route handler
**Decision:** `content/` media (project hero/thumbnail/gallery images) is
served through `src/app/content-media/[...path]/route.ts` rather than being
copied or symlinked into `public/`. The route validates against path
traversal and only serves recognized image extensions — everything else
(PDF, ZIP, TXT, etc. under a project's `files/`) 404s.
**Reason:** `public/` is Next's only statically-served directory, but
copying/symlinking `content/` into it would either duplicate assets on disk
or fight the dev/build tooling. A narrow, purpose-built route handler keeps
`content/` as the single source of truth (per PROJECT.md) while still
letting `next/image` optimize the images. Restricting it to image
extensions is deliberate: it keeps this route from becoming a second,
undeliberate way to fetch project files that are meant to go through the
Milestone 06 download system instead. Resolves the "Next/Image with a fully
dynamic, filesystem-discovered image set" risk logged in ARCHITECTURE.md.

## D-009 — `folderName` kept separate from `slug` on loaded projects
**Decision:** `getAllProjects()`/`getProjectBySlug()` return the parsed
`Project` plus a `folderName` field (the real directory name, e.g.
`001-memora`) that is not part of the Zod schema itself.
**Reason:** The ZIP download system (Milestone 06) must resolve and name
downloads from the actual directory on disk, which may differ from the
URL-facing `slug` (e.g. numeric-prefixed vs. not). Keeping them distinct now
avoids a breaking change to the loader's return shape later.

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
