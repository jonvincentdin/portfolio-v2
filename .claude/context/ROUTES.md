# ROUTES.md

## Owner Editor + Database Routes
`/owner` is the private OTP screen; `/editor` is the authenticated ten-section
editor; `/profile-media` serves the single validated profile image.
`/api/auth/request-code`, `/api/auth/verify-code`, and `/api/auth/logout` manage
owner access. `GET/POST /api/editor/content`, profile uploads, project creation,
and project asset uploads are owner-only.

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Home — hero, intro, CTAs, featured project | Server, static |
| `/about` | About Me + Services + Skills | Server, static |
| `/projects` | GT-style project showroom (all projects) | Server shell, Client showroom |
| `/projects/[slug]` | Individual project case study + files | Server, `generateStaticParams()` from loader |
| `/experience` | Experience + Education + Certifications + Achievements | Server, static |
| `/contact` | Contact form + social links | Server shell, Client form |
| `/content-media/[...path]` | Serves image files from `content/` for use with `next/image` (image extensions only — not a general file server) | Route handler, dynamic |
| `/api/projects/[slug]/download` | Streams full project folder as ZIP | Route handler (Node runtime) |
| `/api/projects/[slug]/files/[...path]` | Serves a single downloadable file, whitelisted against that project's `files[]` entries | Route handler (Node runtime) |
| `/api/editor/projects` | Creates a project record with required hero and thumbnail assets | Owner-only route handler (Node runtime) |
| `/api/editor/projects/[id]/assets` | Uploads/replaces project media and downloadable assets | Owner-only route handler (Node runtime) |
| `/api/editor/media` | Lists, creates, and removes unlinked reusable library assets | Owner-only route handler (Node runtime) |
| `/api/contact` | Validates and stores a contact submission in PostgreSQL when configured | Route handler (Node runtime) |
| `/sitemap.xml` | Dynamic sitemap, includes every discovered project | `app/sitemap.ts` (Node runtime) |

In database mode, project media and downloads resolve from `ProjectAsset` rows;
without `DATABASE_URL`, these routes use the checked-in project folders.
| `/robots.txt` | Crawl rules, points to the sitemap | `app/robots.ts` |
| `/opengraph-image` | Generated default social-share image | `app/opengraph-image.tsx` (`next/og`, Node runtime) |

## Notes
- `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` were added in
  Milestone 13 using Next.js's App Router file conventions — see
  ARCHITECTURE.md's "SEO Infrastructure" section.
- `app/template.tsx` wraps every route's content in a `motion.div`
  providing the page-level enter/exit transition (spec §31, Milestone 12).
  It's paired with `PageTransition` (rendered in `layout.tsx`) — see
  MOTION.md and DECISIONS.md D-026 for why both pieces are required.
- `ScrollRestoration` is mounted in the root layout. It resets newly opened
  routes to the top after the route commits, resolves cross-route hash targets,
  and leaves `popstate` navigation to the browser's native history restoration.
- `/contact` is fully built as of Milestone 10: form (name/email/subject/
  message) with client + server validation sharing one Zod schema, an
  idle/sending/success/error state machine, and a direct email + social
  links block below. `POST /api/contact` genuinely validates and logs
  submissions but doesn't yet deliver real email — see DECISIONS.md D-020.
- `/experience` is fully built as of Milestone 09: Experience (scroll-linked
  timeline), Education, Certifications, and Achievements, each sourced from
  its own loader and each section — heading included — hidden entirely when
  its content is empty.
- `/about` is fully built as of Milestone 08: headline + philosophy prose
  (`lib/about.ts`), Engineering Principles, Services (from
  `getAllServices()`), and Skills (from `getAllSkillCategories()`, telemetry
  panels via `SkillDashboard`) — all three lists deliberately avoid
  equal-sized card grids / generic pills (spec §11, §25). This completes the
  route's original three-piece grouping (About Me + Services + Skills).
- `/projects/[slug]` is fully wired as of Milestone 06: hero, conditionally-
  rendered case study prose sections, features, specs, gallery, links, and
  Project Files all sourced from `getProjectBySlug()`. Every optional
  section is omitted (not shown empty) when the underlying data is absent.
- Both `/api/projects/[slug]/*` routes validate `slug` against
  `getAllProjects()`'s closed set before touching the filesystem — this
  doubles as the path-traversal defense (see ARCHITECTURE.md and
  DECISIONS.md D-015/D-016).
- `/projects` is fully wired as of Milestone 04: `getAllProjects()` on the
  server, `ProjectShowroom` (client) for the interactive state. Handles the
  zero-projects empty state explicitly rather than mounting an empty
  showroom.
- `/about` intentionally bundles About/Services/Skills (spec's recommended
  grouping) to avoid over-fragmenting the site into ten thin pages.
- `/experience` intentionally bundles Experience/Education/Certifications/
  Achievements as one coherent timeline+specification page.
- `[slug]` params for `/projects/[slug]` and the download API both resolve
  through the same trusted `getAllProjects()`/`getProjectBySlug()` loader —
  there is exactly one source of truth for valid slugs, which doubles as the
  path-traversal defense for the download endpoint.
- If, during implementation, a different grouping clearly improves UX (e.g.
  splitting Skills out of `/about`), the change will be proposed and recorded
  in DECISIONS.md before being made — not applied silently.
