# PROJECT.md

## Name
Automotive / Gran Turismo–Inspired Developer Portfolio

## Purpose
A personal developer portfolio that presents projects the way a premium automotive
showroom presents vehicles — one project "unveiled" at a time, with a GT-style
selector, technical specification tables, and cinematic, mechanical motion.
The goal is a portfolio that reads as an original, engineered digital product,
not a template with car imagery bolted on.

## Automotive Concept — How It Manifests
The automotive identity comes from **system**, not decoration:
- Typography treatment (uppercase labels, tracked letter-spacing, numbering)
- Technical metadata blocks (STACK / STATUS / YEAR / ROLE)
- Specification tables (dot-leader rows: `FRAMEWORK ......... NEXT.JS`)
- Angular geometry (clipped panels, diagonal separators, skewed accents)
- Directional, mechanical motion for navigation (previous/next, thumbnail rail)
- A single dominant accent color per session, used sparingly and structurally

Literal automotive iconography (steering wheels, car silhouettes, chrome, engine
photos) is explicitly out of scope. The feeling is engineered precision, not
literal cars.

## Target Audience
- Recruiters / hiring managers evaluating a full-stack developer
- Technical peers assessing engineering quality and code taste
- Potential clients evaluating for freelance/contract work

## Stack (see ARCHITECTURE.md for rationale)
Next.js (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · Zod ·
Lucide Icons (optional) · `archiver` (server-side ZIP streaming)

## Core Requirements
1. Projects, experience, education, certifications, achievements, services, and
   skills are all driven by content files (JSON) discovered automatically from
   the filesystem — never hard-coded into components.
2. The Projects section is a GT-style showroom: one project on screen at a time,
   previous/next navigation, thumbnail rail, animated metadata/spec transitions.
3. Every project supports arbitrary downloadable files, plus a "download entire
   project as ZIP" action that streams the whole project folder server-side.
4. Animation is a first-class requirement throughout, built on shared motion
   tokens, with full `prefers-reduced-motion` support.
5. Fully responsive with deliberate (not just scaled-down) mobile layouts.
6. Accessible: semantic HTML, keyboard navigation, focus management, contrast.

## Non‑Negotiables (from spec §81)
**Never:**
- Hard-code projects in React arrays / manually register projects
- Use generic equal-sized project cards as the primary Projects UI
- Fabricate skill percentages or levels not explicitly supplied
- Use dozens of rounded glassmorphic cards as the default UI language
- Copy real manufacturer or game branding (Lamborghini, Bugatti, Gran Turismo)
- Treat automotive styling as surface decoration only
- Build all milestones in one pass without stopping for review
- Ignore `.claude/context/` at the start of a milestone
- Change architecture without recording the decision in DECISIONS.md
- Pretend a deployed serverless function can permanently write to the Git repo

**Always:**
- Discover and validate content dynamically (Zod)
- Keep server/client component boundaries deliberate
- Make project navigation the standout interaction of the site
- Design mobile layouts on purpose, not as a shrink of desktop
- Update context docs at the end of every milestone, then stop
