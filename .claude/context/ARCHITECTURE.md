# ARCHITECTURE.md

## Owner Editor + Database Architecture
The logo opens `/owner`, where a six-digit OTP is requested and verified by
`/api/auth/request-code` and `/api/auth/verify-code`. OTPs are hashed,
single-use, five-attempt, ten-minute challenges with IP cooldown/rate limits.
Successful verification creates a hashed server-side session represented by an
HTTP-only `owner_session` cookie; `/api/auth/logout` revokes it. Resend is the
production delivery provider; `AUTH_DEV_MODE=true` is an explicit local-only
fallback that logs the code server-side.

`/editor` is server-gated, while `EditorShell` owns client draft state. Save
parses `EditorSnapshotSchema`, validates database project/asset references,
writes normalized relational records in one Prisma transaction, and
revalidates the public layout. With `DATABASE_URL` configured, public loaders
read PostgreSQL; without it they retain the checked-in filesystem baseline for
local preview, while editor persistence/uploads are disabled with an explicit
setup error. Profile/project uploads are validated and stored as database
binary data, then served through `/profile-media`, `/content-media`, and the
download routes. Auth challenge/session state remains in `.data/`.

## Confirmed Stack Versions (as of Milestone 01)
Next.js 16 (App Router, Turbopack build), React 19, TypeScript 5 (strict),
Tailwind CSS v4 (CSS-first config via `@theme inline` in `globals.css` — no
`tailwind.config.ts`). `npx next typegen` regenerates the route param types
(`LayoutProps`, etc.) without running a full build — useful for type-checking
in environments without network access for font fetching (see PROGRESS.md).

## High-Level Architecture
Next.js App Router project, server-first by default. Checked-in JSON/media under
`content/` is the seedable fallback and development source baseline. Runtime
content is normalized into PostgreSQL by Prisma, mapped back through the same
Zod schemas in `lib/schemas/`, and exposed to pages/components as typed data.
Interactive pieces (the showroom, mobile nav, contact form, gesture handling,
and editor controls) are isolated client components; everything else renders
on the server.

```
content (seed/fallback) + PostgreSQL (runtime source of truth)
   │  fs.readdir / fs.readFile
   ▼
lib/content/*.ts  (loaders: discover, parse, sort)
   │  Zod .parse()
   ▼
lib/schemas/*.ts  (validation + inferred TS types)
   │
   ▼
app/**/page.tsx (server components — fetch loaders directly, no client fetch)
   │
   ▼
components/** (server components by default; "use client" only where needed)
```

## Project Discovery (core mechanism)
> **Status:** Implemented in Milestone 02 (`src/lib/content/projects.ts`).
> Not yet consumed by any route — Milestone 04/06 wire it into the showroom
> and case-study pages.

`lib/content/projects.ts` exports `getAllProjects()` / `getProjectBySlug(slug)`:
1. `fs.readdirSync('content/projects')` → list of folder names (e.g. `001-memora`).
2. For each folder, read `project.json`, parse with `ProjectSchema.safeParse`.
3. On validation failure: throw a developer-facing error naming the folder and
   the failing field(s) — implemented as `ContentValidationError`, which can
   report several failing fields from a single file in one error.
4. Resolve media paths relative to the project folder; verify referenced files
   exist (`hero`, `thumbnail`, gallery entries, `files[].path`); missing files
   raise a `ContentFileError` identifying `project.json → field → path`.
5. Sort by `order` ascending; ties broken by the numeric folder prefix, then
   by `year` descending.
6. Slugs are checked for uniqueness across all folders (a duplicate throws a
   `ContentValidationError` naming both folders) — this same uniqueness
   guarantee is what makes slug-based lookups safe to use for filesystem
   resolution in the future download API (Milestone 06).
7. Cached at module scope for the lifetime of the process (dev server or
   build worker) via a simple `let cache: T[] | null` — not a persistent
   cache, just avoids re-reading the filesystem on repeated calls within one
   run.

This same discover → validate → sort pattern is reused for experience,
education, certifications, achievements, services, and skills loaders — one
loader module per content type, one schema per content type, all following an
identical shape so the pattern stays predictable. The single-file content
types share a generic `loadJsonCollection(dirName, schema)` helper in
`fs-utils.ts`; only `projects.ts` has bespoke folder-walking logic, since a
project is a directory rather than one JSON file.

**Error handling policy:** in development, invalid content throws immediately
and loudly (fast feedback while authoring JSON). In production builds, the
same validation runs at build time (Next.js static generation), so a bad
`project.json` fails the build rather than shipping broken data — this is
correct for a mostly-static personal portfolio.

## Server/Client Boundaries
**Server components (default):** route `page.tsx` files, `ProjectSpecs`,
`ProjectFeature`, `ProjectGallery`, `ProjectFiles`, `SkillDashboard`,
`ExperienceTimeline`, `SectionHeading`, `AngularPanel`, `Footer`.

**Client components ("use client"):** `ProjectShowroom` / `ProjectViewer`
(state: current index, direction; Framer Motion variants + drag-based swipe,
implemented Milestone 05), `ProjectThumbnailRail` (scroll-into-view +
Framer Motion `layoutId` active indicator), `ProgressIndicator` (Framer
Motion `AnimatePresence` counter slide), `MobileNavigation`, `PageTransition`,
`Reveal` (uses `IntersectionObserver` / `useInView`), `ContactForm` (state +
submission), `MotionImage` (hover/parallax), download-button state machine
(idle → preparing → building → ready).

Rule of thumb applied throughout: state and gesture/animation logic live in
the smallest possible client boundary; data fetching and static layout stay
server-side and are passed down as props.

**Client-safe data helpers (added Milestone 04):** `lib/content/` mixes
filesystem-reading modules (`projects.ts`, `fs-utils.ts`, etc. — all import
`node:fs`/`node:path`) with pure, client-safe helpers. `getProjectMediaUrl`
lives in its own module, `lib/content/media.ts`, specifically so client
components can import it without pulling Node built-ins into the browser
bundle — see DECISIONS.md D-012 for the build failure this fixes. **Rule
going forward:** any function a client component needs at runtime (not just
as a type) must live in a module with zero `node:*` imports; client
components should import such helpers directly (`@/lib/content/media`), not
through the `@/lib/content` barrel, which re-exports the fs-heavy modules
too. Type-only imports (`import type`) are always safe through the barrel,
since they're erased at compile time.

## Routing
See ROUTES.md for the full table. Dynamic project case studies use
`app/projects/[slug]/page.tsx` with `generateStaticParams()` sourced from the
same `getAllProjects()` loader, so new project folders are automatically
statically generated with zero route changes.

## Serving Content Media (Milestone 03)
`content/` lives outside `public/`, which is the only directory Next.js
serves statically — so project images referenced from `project.json`
(hero/thumbnail/gallery) aren't reachable by `next/image` out of the box.
`src/app/content-media/[...path]/route.ts` bridges this: a Route Handler
that resolves a request path against `CONTENT_ROOT`, rejects anything that
could escape it (no `..`, no extra path separators in a segment, plus a
second check that the fully-resolved path still starts with
`CONTENT_ROOT`), and serves the file only if its extension is a known image
type (webp/png/jpg/jpeg/svg/gif/avif) — any other extension (pdf, zip, txt,
etc.) 404s deliberately, since downloadable project files go through the
dedicated, slug-validated download system in Milestone 06 instead. A small
helper, `getProjectMediaUrl(project, relativePath)` in `projects.ts`, builds
the corresponding `/content-media/projects/<folderName>/<relativePath>` URL
for use as an `<Image src>`. Verified end-to-end against a running
production build: the URL resolves through Next's built-in image optimizer,
the traversal attempt 404s, and the PDF-via-image-route attempt 404s.

## ZIP Download System
> **Status:** Implemented in Milestone 06
> (`src/app/api/projects/[slug]/download/route.ts`).

`GET /api/projects/[slug]/download`:
1. Validate `slug` against the known set from `getAllProjects()` (reject
   anything not in that set — this is also the path-traversal defense, since
   the filesystem path is never built from raw user input, only from a
   pre-validated slug → folder-name lookup).
2. Resolve the absolute project directory once, from the trusted lookup
   (`getProjectDirectoryPath`, exported from `projects.ts` for this purpose).
3. `archiver` v8's `ZipArchive` class (not the classic factory function —
   see DECISIONS.md D-015) recursively adds the whole directory via
   `.directory(projectDir, folderName)`, preserving the relative folder
   structure under a top-level `<project-folder-name>/` entry — this is
   `archiver`'s own recursive directory-add, not a hand-rolled `fs.readdir`
   walk.
4. `archive.finalize()` is called without `await` (so entry-adding runs
   concurrently with the response body being streamed) but with a `.catch()`
   so a failure logs instead of becoming an unhandled rejection.
5. `Readable.toWeb(archive)` adapts the Node stream to a Web `ReadableStream`
   for the Response body — never buffers the whole ZIP in memory.
6. Sets `Content-Type: application/zip` and
   `Content-Disposition: attachment; filename="<folder-name>.zip"`.

Verified with real downloads (not just code review): `unzip -l` on the
downloaded archive confirms the folder structure is preserved correctly,
including subfolders (`files/`, `screenshots/`), for both a project with a
`files/` subfolder and one without. Unknown slugs correctly 404.

Individual file downloads
(`src/app/api/projects/[slug]/files/[...path]/route.ts`) serve directly from
the validated project directory using the same slug-lookup pattern — never a
raw path from the client — plus one additional layer: the requested relative
path must exactly match one of the project's own `files[].path` entries, not
merely resolve inside the project directory (see DECISIONS.md D-016). This
means `hero.webp` — a real file in the folder, but never declared as
downloadable content — correctly 404s through this route even though it
would pass a plain path-traversal check.

File size for the `ProjectFiles` list is derived with
`getProjectFileSizeBytes()` (`fs.statSync(...).size` under the hood) at
render time and formatted (KB/MB) via `formatFileSize()` — never
hand-maintained in JSON. Verified against the example content's real
PDF/TXT files ("39 KB", "85 B").

## Validation & Types
Every content shape has one Zod schema in `lib/schemas/`, and the TypeScript
type is inferred (`z.infer<typeof ProjectSchema>`) rather than hand-duplicated.
Schemas are the single source of truth for both runtime validation and
compile-time types.

## Data Loading vs. Runtime Storage (see PROJECT.md, spec §64)
`content/` remains committed as the reviewable seed and local fallback.
Runtime owner edits use PostgreSQL through Prisma; uploads are stored as
database binary assets rather than written to the Git repository. The editor
rejects content saves until the database is provisioned. Auth challenge/session
state remains in `.data/`.

## Runtime Database Model
`prisma/schema.prisma` models site/about/contact settings, social links, all
portfolio collections, projects, project links/features/assets, profile media,
and contact submissions. `prisma/seed.ts` imports the checked-in baseline and
stores every project binary as a `ProjectAsset` row. `src/lib/content/database.ts`
maps rows back to the existing editor/public schemas, so the UI and download
contracts do not diverge between source fallback and database mode.

## SEO Infrastructure (Milestone 13)
`src/app/sitemap.ts` and `src/app/robots.ts` use Next.js's App Router
conventions (a default-exported function returning `MetadataRoute.Sitemap`/
`MetadataRoute.Robots`) rather than static XML/text files, so the sitemap
stays in sync with `getAllProjects()` automatically. `src/app/
opengraph-image.tsx` uses `next/og`'s `ImageResponse` to generate a
branded default share image at build time (Node runtime — the `edge`
runtime this route originally used is deprecated in this Next.js version).
Every page's `metadata` export includes an explicit `openGraph` override
(and the case study additionally sets `twitter` and a real project image)
since Next.js merges `openGraph`/`twitter` as whole objects between a
route and its parent layout — without a per-page override, every page
would silently inherit the root layout's homepage-branded social preview.

## Accessibility Architecture (Milestone 13)
- **Skip link:** a visually-hidden-until-focused `<a href="#main-content">`
  as the very first focusable element in `<body>`; its target (`<main>`)
  has `tabIndex={-1}` so keyboard focus actually lands there, not just
  scroll position (a plain matching `id` alone isn't sufficient — see
  DECISIONS.md D-031).
- **Mobile menu as a real dialog:** `role="dialog"`, `aria-modal="true"`,
  `aria-hidden` toggled with open state, a focus trap (Tab/Shift+Tab cycle
  within the menu only), Escape-to-close, and focus returned to the
  trigger button on close — see DECISIONS.md D-035.
- **Two-tier border tokens:** `--border` (subtle, decorative dividers/
  panels) vs. `--border-strong` (form input boundaries, meeting WCAG
  1.4.11's 3:1 non-text contrast minimum) — see DECISIONS.md D-030.
- **Heading hierarchy:** every page has exactly one `<h1>`; section labels
  that precede `<h3>`-headed content render as real `<h2>` elements via
  `TechnicalLabel`'s `as="h2"` option, preserving identical visual styling
  — see DECISIONS.md D-034.
- Verified with `axe-core` (industry-standard automated accessibility
  testing, temporarily installed and removed — see DECISIONS.md D-033)
  against all 6 representative pages, checking `wcag2a`/`wcag2aa`/
  `best-practice` rules: zero violations after the fixes above.

## Visual Experience Continuation (Milestones 05–10)

The visual layer is intentionally an enhancement over the existing portfolio.
`RootLayout` loads `getSiteExperience()` from the existing database/source
snapshot and mounts `CursorEngine` and `AudioEngine` once. Cursor and sound
behavior is then delegated from semantic controls via data attributes. The
Home hero uses `HeroExperience`, a lightweight CSS/pointer layer with no 3D
asset dependency and a complete coarse-pointer/reduced-motion fallback.

Audio assets use the existing `MediaAsset`/media-library path with `kind`
`audio`; the content-media route validates and serves only stored image/audio
media. Generated Web Audio tones remain the default if no replacement asset is
configured. `SiteSettings.siteExperience` is validated by Zod and persisted
alongside the current editor snapshot, preserving one CMS source of truth.

## Visual Experience Continuation (Milestones 11–15)

The public interaction layer remains data-independent: project media depth is
handled by `ProjectInteractiveFrame`, education progression derives directly
from the existing education collection, and skill expansion derives directly
from the existing skill categories. No duplicate content arrays or editor-only
presentation data were introduced. The interactions are client-isolated and
fall back to ordinary readable content for touch and reduced-motion users.

M16 credential cards resolve optional certification/achievement images through
the same `/content-media` boundary: checked-in collection paths use their
collection directory, while `library/{id}` values use the managed media
record. Missing images render an explicit fallback and cannot remove the
credential text or verification action.

## Technical Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Large/animated showroom causes jank on lower-end devices | Animate only `transform`/`opacity`/`clip-path`; `will-change` sparingly; test with CPU throttling in Milestone 05/13 — Milestone 05's implementation animates only `x`/`opacity` (card transitions), `y`/`opacity` (counter), and relies on Framer Motion's `layoutId` (GPU-friendly `transform`) for the thumbnail indicator; no width/height/top/left animation anywhere |
| ZIP streaming memory pressure on large projects | Stream via `archiver` + Node stream piping, never buffer full ZIP |
| Path traversal via project slug or file path | Slug validated against a closed set from the loader; file paths resolved only from validated project directories, never from raw request input |
| Content drift (JSON references a file that doesn't exist) | Build-time validation throws a developer-facing error naming folder + field + path |
| Next/Image with a fully dynamic, filesystem-discovered image set | **Resolved (Milestone 03):** `/content-media/[...path]` route handler serves image files from `content/` with path-traversal defense and an image-extension allowlist; `getProjectMediaUrl()` builds the URL. See ARCHITECTURE.md §Serving Content Media. |
| Reduced-motion regressions as motion complexity grows | Centralize all durations/easings in `lib/motion` tokens and gate complex variants behind a single `usePrefersReducedMotion()` hook, audited in Milestone 12 — hook implemented Milestone 05 (`src/lib/motion/usePrefersReducedMotion.ts`), consumed by all three new Framer Motion showroom components; a full sitewide audit is still Milestone 12 |
| Scope creep across 15 milestones | Strict "read context → implement only current milestone → update context → stop" workflow (spec §80) |
