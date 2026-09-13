# DECISIONS.md

Record of architectural/design decisions, each with the reasoning behind it.
Newest entries at the top.

## D-040 — PostgreSQL is the runtime CMS source of truth
The editor persists one Zod-validated snapshot into normalized PostgreSQL
records through Prisma. Project and profile uploads are stored as database
binary data, while checked-in `content/` remains the seedable fallback. A
single Prisma transaction keeps a multi-section editor save consistent; the
editor refuses persistence when `DATABASE_URL` is not configured.

The earlier `.data/portfolio-overrides.json` implementation from Milestone 15
is superseded because runtime project creation and binary uploads require a
durable database-backed store.

## D-041 — Reusable media library plus project-specific links
Binary uploads are stored once in `MediaAsset`. Projects reference them through
`ProjectAsset` rows that retain project-relative paths and usage kinds. This
allows one image or file to be reused across projects, preserves the existing
public URL/download contract, and avoids coupling a global asset to one
project's editorial structure. Legacy project binaries are backfilled with a
separate migration command.

## D-037 — Full runtime snapshot over source defaults
This historical Milestone 15 decision is superseded by D-040. The ignored JSON
override file is no longer read or written; runtime content persistence now
requires PostgreSQL.

## D-038 — OTP delivery with explicit development mode
Owner access uses hashed, expiring, single-use OTP challenges. Production
delivery requires Resend credentials; `AUTH_DEV_MODE=true` is the explicit
local fallback and logs the code only on the server.

## D-039 — Fixed profile media target and server validation
Profile media uses a fixed database record and a dedicated serving route;
extension, MIME, magic bytes, byte size, and dimensions are checked before
replacement. Project assets use validated relative paths and database rows to
avoid filename/path traversal risk.

---

## D-036 — Final visual QA favors restrained system cues over new features
**Decision:** Milestone 14's final design polish adds a low-contrast technical
grid to the global dark canvas, a desktop-only angular calibration frame to
the Home hero, a short accent registration mark to shared `AngularPanel`
surfaces, balanced/prettier text wrapping, and safe wrapping for project-file
rows. No new route, content type, feature, interaction, or animation system
was introduced.
**Reason:** Source-level review of the completed site showed that its strongest
custom qualities already came from the showroom, specification rows, angular
geometry, typography pairing, and restrained motion. The remaining risk was
not missing functionality but isolated areas reading as a conventional
developer template. These small, shared cues strengthen the existing visual
language across pages without competing with project imagery or violating the
single-accent / quality-over-quantity rules. The in-app browser was unavailable
for this pass, so verification used compiled development CSS, rendered HTML,
production build output, and route/API smoke tests; no screenshot-based result
is inferred.

## D-035 — Mobile menu given full dialog semantics: focus trap, Escape-to-close, and landmark labeling
**Decision:** The mobile menu overlay now has `role="dialog"`,
`aria-modal="true"`, `aria-hidden={!isOpen}`, a distinct `aria-label`, and
a real focus trap: opening it moves focus to the first nav link, `Tab`/
`Shift+Tab` cycle only among the menu's own links (never escaping into the
page behind it), `Escape` closes it, and closing returns focus to the
hamburger button. Both the desktop (`SiteHeader`) and mobile
(`MobileNavigation`) `<nav>` elements also gained distinct `aria-label`s
("Primary" / "Mobile").
**Reason:** A `position: fixed`, `aria-modal="true"` overlay that
functionally blocks interaction with the rest of the page needs to behave
like an actual modal for keyboard and screen reader users, not just
visually — without a focus trap, `Tab` would silently move focus into
invisible content behind the overlay; without `aria-hidden` toggling, a
screen reader could perceive the closed menu's links as a second, always-
present navigation landmark, which is also what `axe-core`'s
`landmark-unique` rule flagged (two `<nav>` elements with no distinguishing
label — see D-033). Verified with real keyboard input, not just code
review: opening the menu moves focus to "Home" (the first link); pressing
`Tab` six times (more than the five real links) wraps back around within
the menu rather than escaping it; `Escape` closes the menu and returns
focus to the "Open menu" button; and a full re-run of the `axe-core` scan
confirms zero landmark violations remain.

## D-034 — Section-title labels promoted to real `<h2>` where they precede `<h3>` content
**Decision:** `TechnicalLabel`'s `as` prop gained an `"h2"` option, and every
section-title label that directly precedes `<h3>`-headed content (About's
Engineering Principles/Services/Development Systems; Experience's Work
History/Education/Certifications/Achievements; the case study's Features)
now renders as a real `<h2>` instead of a styled `<div>`.
**Reason:** Found by an automated `axe-core` scan (see D-033), not code
review: About, Experience, and the case study page each had at least one
`<h1>` → `<h3>` jump with no `<h2>` in between, a real WCAG 2.4.6/1.3.1
semantic-heading violation, not just a linter nitpick — screen reader users
navigating by heading list would encounter unlabeled content structure.
Section labels that don't precede any heading-level content (e.g. "Project
Specifications," "Screenshots," "Links," "Direct," kicker labels like
"Project 001" that sit beside an existing `<h2>`) were deliberately left as
non-heading elements — promoting every visual label to a heading regardless
of content would dilute the document outline rather than clarify it.
Verified: re-running the same `axe-core` scan afterward found zero
heading-order violations on any of the 6 audited pages.

## D-033 — Milestone 13 accessibility audit used axe-core, not just manual/contrast checks
**Decision:** In addition to manually computing WCAG contrast ratios and
manually testing keyboard/focus behavior, Milestone 13 ran Google's
`axe-core` (industry-standard automated accessibility testing engine,
installed temporarily via `npm install --no-save`, never added to
`package.json`) against all 6 representative pages via a real headless
browser, checking the full `wcag2a`/`wcag2aa`/`best-practice` rule sets.
**Reason:** Automated scanning catches classes of issues manual spot-
checking reliably misses — exactly what happened here: it found 3 distinct
real bugs (a genuine color-contrast failure on nav index numbers at a
reduced opacity that "looked fine" visually but measured well under 4.5:1;
missing heading levels; and duplicate unlabeled `<nav>` landmarks) that
weren't part of the pre-planned fix list. Re-running the exact same scan
after fixing all three confirms zero violations across every page — a
concrete, reproducible pass/fail signal beyond "looks right." `axe-core`
was removed from `node_modules` after use, then discovered to actually be
a real transitive dependency of `eslint-plugin-jsx-a11y` (used by this
project's own ESLint config) — reinstalled via a plain `npm install` to
restore it, rather than left broken.

## D-032 — Dynamic sitemap, robots.txt, and per-page OpenGraph/Twitter metadata
**Decision:** `src/app/sitemap.ts` and `src/app/robots.ts` (Next.js's
App Router conventions) were added; every page's `metadata` export now
includes an explicit `openGraph` (and, for the case study, `twitter`)
override, not just a bare `title`/`description`.
**Reason:** Two real, distinct SEO gaps. First, no sitemap or robots.txt
existed at all — `sitemap.ts` generates project case-study URLs from
`getAllProjects()` (the same loader every other page uses, so a new
`content/projects/` folder appears in the sitemap automatically);
`robots.ts` allows normal crawling while blocking `/api/` and
`/content-media/`, neither of which is meant to be indexed. Second, Next.js
metadata merges `openGraph`/`twitter` as whole objects between a route and
its parent layout — a child page that doesn't define its own `openGraph`
silently inherits the ROOT layout's (the homepage's title/description), so
without a per-page override, sharing a link to `/about` or a project case
study on social media would show the homepage's title, not the actual
page's. The case study page's `openGraph.images` uses the project's real
hero image via the existing `getProjectMediaUrl()` helper.

## D-031 — Skip link target needs `tabIndex={-1}`, not just a matching `id`
**Decision:** `<main id="main-content">` gained `tabIndex={-1}` (and
`outline-none`, since it's never part of the normal Tab sequence — only a
script/fragment-navigation target).
**Reason:** A real, verified-with-a-real-keypress bug: the skip link
(`<a href="#main-content">`) correctly received focus on the first Tab
press and correctly scrolled the page when activated, but keyboard focus
itself landed on `<body>`, not `<main>` — browsers scroll to a URL
fragment's target but only move *focus* there if the target is actually
focusable. Without `tabIndex={-1}`, a keyboard user activating the skip
link would have to Tab again from the very top of the page, defeating the
skip link's entire purpose. Verified before and after: `document.
activeElement.id` was `"BODY"` before the fix, `"main-content"` after.

## D-030 — A second, more visible border token added for interactive-element boundaries
**Decision:** `--border-strong: #606060` was added alongside the existing
`--border: #242424`, used specifically for form input boundaries (the
Contact form's fields), not for the site's decorative dividers/panel
borders, which keep using the original subtle `--border`.
**Reason:** Computing actual WCAG contrast ratios (not just eyeballing)
found `--border` measures only 1.28:1 against `--background-primary` — far
below the 3:1 WCAG 1.4.11 "non-text contrast" minimum for UI component
boundaries. This is an acceptable, deliberate choice for ambient dividers
and panel edges (which aren't the sole indicator of an interactive
affordance — buttons and links get accent-colored hover/focus states
regardless of their border), but a real usability problem for form input
edges specifically, where the border IS how a user perceives the field's
clickable/typeable boundary. `#606060` measures 3.15:1, clearing the
threshold. The Contact form's inputs also had their `outline-none` (with
only a subtle `focus:border-accent` color change as the sole focus
indicator) reconsidered — kept the border-color change but no longer
relies on it alone, restoring the native focus outline as a second,
independent signal.

## D-029 — Milestone 12 motion scope: what was deliberately not expanded
**Decision:** Beyond the fixes and additions above, Milestone 12
deliberately did NOT: (a) build a general-purpose `MotionImage` component
for hover scale/translate — the two existing usages (`ProjectGallery`'s
`hover:scale-[1.02]`, and nowhere else needs it) are simple enough that a
shared component would be premature abstraction; (b) add intrinsic
entrance animation to `AngularPanel` itself (spec §37's "clipped panel
reveals") — every real usage of `AngularPanel` is already wrapped in
`Reveal` or `ImageMask` at the call site, which already provides a
panel-level entrance animation; adding a second, redundant animation
inside `AngularPanel` itself would violate spec §28's "quality over
quantity" directive; (c) apply the `active:scale-95` press state to purely
textual navigation links (`NavLink`, the header logo) — spec §36's press
example is specifically framed around button-style controls
("DOWNLOAD PROJECT"), and a scale-down press on inline nav text would look
inconsistent with its underline-only hover treatment.
**Reason:** Recorded so these are legible as deliberate choices, not gaps
that were simply missed during the audit.

## D-028 — Tailwind v4 arbitrary-value `scale-[...]` combined with `active:` does not compile; use standard scale steps
**Decision:** All press-state additions in this milestone use
`active:scale-95` (a named Tailwind scale step), not the originally-written
`active:scale-[0.98]` (an arbitrary bracket value).
**Reason:** A real, silent build issue found only by inspecting the
compiled CSS output, not by code review: `active:scale-[0.98]` produced no
CSS rule at all in this project's exact Tailwind v4 version — confirmed by
grepping the built `.css` file directly and finding zero occurrences,
compared to `hover:scale-[1.02]` (arbitrary value, different variant) and
`active:scale-90` (named value, same variant) which both compiled
correctly. The combination of `active:` specifically with a bracketed
arbitrary value is what silently failed. This is also why the bug was
invisible for a while even after adding real-browser interaction tests:
checking `getComputedStyle(el).transform` (the traditional CSS transform
property) always reported `"none"`, which looked like confirmation the
press state wasn't applying — but Tailwind v4's scale utilities set the
native CSS `scale` property, not `transform: scale(...)`, so that check was
looking at the wrong property regardless. Verified the fix by checking
`getComputedStyle(el).scale` directly during a real mouse-down: reports
`"0.95"` as expected, across all four affected components.

## D-027 — ImageMask uses a manual IntersectionObserver, split across two elements
**Decision:** `ImageMask` does not use Framer Motion's `whileInView` prop.
It uses the same manually-managed `IntersectionObserver` pattern as
`Reveal`, and — critically — observes a plain, unclipped wrapper `<div>`
rather than the `motion.div` that actually carries the animated
`clip-path`.
**Reason:** Two real bugs found via real-browser testing, not code review:
(1) `whileInView` never fired in this project's exact Framer Motion
version, leaving the image permanently hidden; switching to the proven
manual-observer pattern fixed this. (2) Even after that fix, observing the
SAME element that carries `clip-path: inset(0 0 0 100%)` still failed —
because a target clipped down to zero visible area has zero intersection
by definition, `IntersectionObserver` correctly reports `isIntersecting:
false` for it regardless of scroll position, since clip-path (like
`overflow: hidden`) is one of the properties browsers account for when
computing the actual visible intersecting area, not just raw layout
geometry. Splitting the observed (unclipped) wrapper from the animated
(clipped) inner element resolves the self-defeating combination. Verified
by sampling the clip-path value at multiple timepoints during the reveal —
it animates smoothly from `inset(0 0 0 100%)` to `inset(0 0 0 0%)` over the
expected ~700ms.

## D-026 — Page transitions require `app/template.tsx`, not a manual `usePathname()` key in the layout
**Decision:** Route-level page transitions are split into two pieces:
`PageTransition` (a persistent `AnimatePresence` wrapper, rendered once in
`layout.tsx`) and `app/template.tsx` (the actual `motion.div` with
enter/exit variants).
**Reason:** A real, serious bug found via real-browser testing: an initial
implementation used a single component in `layout.tsx` with
`<AnimatePresence><motion.div key={usePathname()}>{children}</motion.div>
</AnimatePresence>`. The exit animation played correctly, but the incoming
page then rendered permanently invisible (stuck at the exit's final
`opacity: 0`) — confirmed by sampling `opacity`/`transform` at multiple
timepoints after a real click and watching it never recover. Root cause:
`usePathname()` and Next.js's routed `children` prop both update in the
same render pass on navigation, so `AnimatePresence` never observed a
genuine "old element removed, new element added" transition — just one
already-mounted instance whose content silently changed, which Framer
Motion doesn't replay `initial → animate` for (that sequence only runs on
a true mount). `template.tsx` is Next.js's own documented mechanism for
this exact scenario: it creates a genuinely new component instance on
every navigation, which is the real mount/unmount signal
`AnimatePresence` needs. Verified after the fix: sampling opacity/x at
seven timepoints across a real click shows a clean 0→1 / 30→0 curve that
settles at `opacity: 1, transform: none` and stays there — confirmed
`prefers-reduced-motion` also collapses correctly to an instant, opacity-
only settle.

## D-025 — ProjectThumbnailRail no longer scrolls the page on initial mount
**Decision:** `ProjectThumbnailRail`'s scroll-into-view effect now skips
its very first run (tracked via a `isFirstRender` ref) and, when it does
run, scrolls the rail's own horizontal scroll container directly
(`rail.scrollTo({ left: ... })`) rather than calling
`element.scrollIntoView()`.
**Reason:** Found with a real browser, not code review: on load, the page
was silently auto-scrolling ~360px downward with zero user interaction.
`scrollIntoView()`'s effect ran on mount (as all effects do, since
`activeIndex` starts at 0), and because the thumbnail rail starts below the
fold on most viewports, bringing it into view pulled the *entire page*
down — a jarring, unrequested jump on every single page load. Scrolling
the rail's own container directly also removes any future risk of the
same side effect recurring for other reasons `scrollIntoView` might decide
vertical scroll is needed. Verified: `window.scrollY` is `0` immediately
after load and stays `0`, while pressing the arrow keys or clicking a
thumbnail still correctly scrolls the rail horizontally.

## D-024 — MobileNavigation overlay rendered via a portal, escaping the header's backdrop-blur containing block
**Decision:** The full-screen mobile menu is now rendered with
`createPortal` directly into `document.body`, rather than inline inside
`SiteHeader`.
**Reason:** A serious, invisible-in-code-review bug found only through an
actual browser click during this milestone's audit: `<header>` has
`backdrop-blur-sm` (a `backdrop-filter`), which per the CSS spec makes it
the *containing block* for any `position: fixed` descendant. With the
overlay nested inside the header, its `fixed inset-0` resolved
`top/right/bottom/left: 0` against the header's own ~64px-tall box instead
of the viewport — so the "full-screen" menu was actually only ~64px tall,
with its nav links simply overflowing, uncovered, into the page below. The
menu's own background color and the page's base background are the same
color (`#0a0a0a`), which is exactly why this was invisible in every
previous milestone's `curl`-based HTML verification — the bug only shows up
visually, through actual rendering. A portal is the standard, correct fix:
it renders the overlay as a sibling of `<body>`'s other children, entirely
outside the header's containing-block-creating subtree. Verified with a
real click, across three different viewport sizes and two different pages:
the overlay is now fully opaque, correctly full-height, vertically centered
with all five links visible, and the active-page underline renders
correctly.

## D-023 — ProjectViewer's image column stretches to match content height instead of using a fixed aspect ratio on desktop
**Decision:** On `lg+` breakpoints, the project image panel uses
`lg:aspect-auto lg:h-full` (filling its grid area's height) instead of the
fixed `aspect-[16/10]` used on mobile; the outer grid's `items-start` was
removed so grid items default to `align-items: stretch`.
**Reason:** Found via real screenshots at 1024px: the image, sized purely
by its aspect ratio, was noticeably shorter than the left metadata column,
leaving a large, visually awkward empty gap between the image and the
Previous/Next controls beneath it — worse at narrower desktop widths where
the left column's text wraps more. Letting the image stretch to fill the
full height of its row-span (rows 1–4) while the mobile/tablet single-column
flow keeps the original aspect ratio (where there's no shared row height to
match) fixes this at every desktop width without affecting the mobile
layout at all. Verified visually at 1024px, 1280px, and 1440px after the
fix — the image and left column now always end at the same height.

## D-022 — Flex `shrink-0` removed from row values that can contain long joined text
**Decision:** `SpecificationRow`'s value span and `SkillItem`'s
level+bar group no longer use `shrink-0`; the rows now use `flex-wrap` so
content can drop to a second line when it doesn't fit, instead of forcing
horizontal overflow.
**Reason:** Two real, reproducible 375px-viewport overflows found via
screenshot audit: `flex-shrink: 0` forces a flex item to render at its
max-content width regardless of available space — for a joined
technologies list ("Next.js / TypeScript / PostgreSQL / Vercel") or a
skill's level+segment-bar group, that max-content width can exceed a narrow
viewport's available space, and `shrink-0` explicitly disables the normal
wrap/shrink behavior that would otherwise prevent this. Removing it (and
adding `flex-wrap` at the row level) lets these rows degrade gracefully on
narrow screens instead of pushing the whole page wider. Verified: zero
horizontal overflow across all 7 breakpoints × 6 pages after the fix.

## D-021 — Milestone 11's responsive audit used a real headless browser
**Decision:** Milestone 11 was audited with an actual headless Chromium
browser (via Playwright, already present in this sandbox environment
though not previously confirmed working) — real screenshots, real overflow
measurements (`scrollWidth`/`clientWidth`), and real clicks/keyboard/drag
interactions — rather than the code-review-plus-`curl` approach used in
every prior milestone.
**Reason:** This is a meaningful capability change worth recording: Milestones
04, 05, and 09 explicitly flagged "real click/keyboard/touch interaction
testing isn't possible in this sandbox" as a known limitation. That
limitation turned out to be specific to attempting a full Playwright
*install* (browser binary download blocked by the network allowlist) —
a browser was already present at `/opt/pw-browsers` and usable directly.
This audit both fixed real bugs no amount of code review would have caught
(D-022 through D-025) and retroactively confirmed that keyboard navigation,
thumbnail clicks, and the drag/swipe gesture from Milestones 04/05 all
genuinely work correctly — closing out those previously-flagged gaps rather
than leaving them open indefinitely.

## D-020 — Contact form submission validated and logged, not actually emailed
**Decision:** `POST /api/contact` validates the submission server-side
(`ContactFormSchema.safeParse`, mirroring the client-side check so the two
can't drift) and logs a valid submission via `console.log`, returning
`{ ok: true }`. No real email provider (SMTP, Resend, etc.) is wired up.
**Reason:** No email-provider credentials exist in this environment, and
PROJECT.md's non-negotiables already establish the pattern of being honest
about what's genuinely wired vs. stubbed (see the "Data Loading vs. Runtime
Storage" note in ARCHITECTURE.md). Fabricating a working-looking email
integration with no real credentials behind it would be worse than a
clearly-documented placeholder — the form and its validation are fully
real and testable end-to-end (verified with real `curl` requests: valid
submission succeeds, invalid data returns precise per-field errors,
malformed JSON is handled), and wiring a real provider later is an
isolated one-line change inside the route handler.

## D-019 — ExperienceTimeline's scroll-linked line growth built now, not deferred to Milestone 12
**Decision:** The Experience Timeline's growing vertical line (spec §42) —
tied to scroll progress via Framer Motion's `useScroll`, scoped to the
timeline's own container rather than the whole page — was built as part of
Milestone 09, not deferred to Milestone 12 (Motion + Microinteractions).
**Reason:** Spec §42 describes this as intrinsic to the Experience Timeline
component itself, and the master spec's own Milestone 09 description
doesn't scope it out. Milestone 12 is an audit/polish pass over motion
that's already been built elsewhere on the site, not the first
implementation of a component's core defining visual. Building it now
avoids a half-built "timeline" that's really just a plain list until a
later milestone. Respects `usePrefersReducedMotion()` (line renders fully
grown immediately, no animated fill) and uses a small square marker instead
of a circular dot to stay consistent with the site's angular geometry
language (DESIGN_SYSTEM.md — "Angular, not rounded").

## D-018 — Skill levels visualized as a discrete 5-segment bar, not a percentage
**Decision:** `SkillItem` renders a skill's `level` (when supplied) as a
5-segment bar where the filled-segment count equals the level's ordinal
rank in the `SkillLevel` enum (`Learning`=1 … `Primary`=5) — never a
computed/invented percentage. When `level` is absent, no bar renders at
all, not a default or zero-filled one.
**Reason:** Spec §25/§26 explicitly forbid fabricated percentages (no
"React — 95%"), but §41 explicitly permits animating "the visual
representation of the provided level" once supplied. A discrete segmented
bar keyed to the exact enum value the author chose satisfies both: it's a
truthful visualization of real categorical data, not a synthesized number
with false precision. The segment count is derived from
`SkillLevelSchema.options.indexOf(level)` — the same enum ordering defined
back in Milestone 02 — rather than a second hardcoded ranking array, so
there's one source of truth for level order. Verified against real content:
a leveled skill (React, "Advanced") renders exactly 4 filled + 1 unfilled
segment; an unleveled skill (Docker, added specifically to exercise this
path) renders no bar and no level text at all.

## D-017 — About page editorial content centralized in `lib/about.ts`
**Decision:** The About page's headline, philosophy paragraphs, and
engineering principles live in `src/lib/about.ts` as a plain constant
(`ABOUT_CONTENT`), following the same pattern as `lib/site.ts` (D-011).
**Reason:** This is personal/editorial copy — not one of the seven
filesystem-discovered content types in CONTENT_SYSTEM.md — so it doesn't
belong in `content/`. Keeping it in its own file rather than folding it
into `site.ts` keeps `site.ts` focused on cross-page identity (name, role,
social links) while About-page-specific prose has its own home, consistent
with the project's existing "one small file per concern" pattern
(`navigation.ts`, `social.ts`, `site.ts`).

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
`content/` as the seed/fallback source while PostgreSQL is the runtime source,
while still
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
