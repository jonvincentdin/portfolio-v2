# Astra Portfolio Completion Context

Use this file as the entry point for completing the existing portfolio in this repository. The user will provide this context and the project to ChatGPT Astra 6. Treat the repository as the source of truth and read the linked context before making decisions.

## User's goal

The portfolio has a strong automotive / Gran Turismo inspired idea, but it currently feels incomplete, looks visually off, and is hard to navigate. The editor is too complex. Improve the experience around the existing project: projects are the cars in a premium digital showroom, and their motion should be tied to the visitor's scroll. Keep editing content simple and easy to plug in. The user asked for research informed concepts, a clear improvement plan, and only Markdown changes while preparing this brief. Do not change runtime code as part of this task.

## Current project reality

This is an existing Next.js 16 App Router portfolio, not a new build. It already has PostgreSQL/Prisma-backed CMS/editor, JSON seed content, reusable media library, validated project content, public pages, a project showroom, case studies, route transitions, scroll reveals, progress indicator, accessibility and reduced-motion accommodations. Several earlier milestone docs call the original build complete. The current task is to identify and improve gaps based on a fresh UX/visual audit; do not assume prior checklists guarantee the current result is good.

Key existing foundations:
- Automotive visual system, projects as vehicles, dark engineering aesthetic, one restrained accent.
- Shared motion tokens and `prefers-reduced-motion` support.
- Public routes: `/`, `/about`, `/projects`, `/projects/[slug]`, `/experience`, `/contact`.
- `/owner` authentication and `/editor` structured CMS.
- The editor uses a unified validated snapshot and database; media assets are reusable. Keep this source of truth and avoid creating a second content/config format.
- Content can be seeded from JSON; see `docs/ADDING_CONTENT.md`.

## Read these project context files before work

Read in this order, resolving paths from the repo root:

1. `.claude/context/PROJECT.md` — product goals, audience, core constraints.
2. `.claude/context/PROGRESS.md` — what has been implemented and known gaps.
3. `.claude/context/TODO.md` — milestone history, open follow-ups, verification gaps.
4. `.claude/context/ROUTES.md` — current information architecture and navigation.
5. `.claude/context/COMPONENTS.md` — component inventory and ownership.
6. `.claude/context/DESIGN_SYSTEM.md` — visual tokens and composition rules.
7. `.claude/context/MOTION.md` — existing motion vocabulary and reduced-motion rules.
8. `.claude/context/RESPONSIVE.md` — breakpoints and responsive decisions.
9. `.claude/context/CONTENT_SYSTEM.md` — content schema, editor persistence, media model.
10. `.claude/context/ARCHITECTURE.md` — runtime/data and route boundaries.
11. `.claude/context/DECISIONS.md` — decisions that must not be casually reversed.
12. `docs/MILESTONE_01_AUDIT.md` — current visual-system audit and extension points.
13. `docs/ADDING_CONTENT.md` — owner's existing content workflow.
14. `.claude/context/automotive_gran_turismo_portfolio_claude_prompt_v2.md` — original creative brief; use its useful intent, but do not mistake it for current implementation state.
15. `AGENTS.md` — repository-specific instructions. This project uses a version of Next.js with breaking changes: before writing any code, read the relevant guide under `node_modules/next/dist/docs/`.

There is no separate skills folder documented in this repository. Do not invent one or claim a skill file is required. The applicable skill-like guidance is the repository's `AGENTS.md` plus the context documents above.

## Research / design direction

Use current, credible references when a live research tool is available. Research interaction patterns and accessibility/performance guidance for scroll-driven storytelling, product configurators/showrooms, navigation, and approachable content management. Prioritize primary sources for technical claims (official browser/framework/accessibility docs) and inspect actual automotive/editorial references only for patterns, not copying. Cite links in the implementation plan and distinguish inspiration from requirements. If research access is unavailable, state that and label concepts as design recommendations, not researched facts.

### Core concept: scroll-controlled vehicle/project journey

Make a project journey feel like a car moving through a designed course as the visitor scrolls. Scroll progress should control meaningful state: project position/scale or camera framing, environment/background lighting, section markers, and project metadata/case-study beats. The vehicle/project visuals can be a high-quality original 2D/3D asset or layered project imagery; do not require a complex real-time 3D pipeline before proving the concept.

Recommended experience model:
- A short, skippable opening with a clear “Explore projects” action.
- A sticky/pinned showroom stage on desktop where scroll progress advances through a small set of project checkpoints. The project/car visibly travels along a course; progress and current project are always labeled.
- Project checkpoints map to existing project records. Selecting a checkpoint opens its existing case study route or project details, preserving normal links and browser history.
- Ordinary document scrolling remains the input. Avoid hijacking wheel/touch, trapping the visitor in a long pinned sequence, or making scroll distance excessive. Provide “Skip motion / Browse projects” links and previous/next controls.
- On mobile, prefer a shorter, unpinned sequence with swipe/tap checkpoints; avoid heavy parallax and tiny controls.
- Keep scroll response stable across resize, content changes, back/forward navigation, and browser zoom. Use native CSS scroll-driven effects where appropriate, or a narrowly scoped motion implementation with clear fallbacks. Do not assume one experimental API is universally supported.
- Respect `prefers-reduced-motion`: replace travel/parallax with static scenes and direct selectable checkpoints; all project content and controls remain available.
- The animation should explain progress and selection, not become a barrier to reading or navigation.

### Visual direction concepts

- Treat the portfolio as a route through a premium automotive design studio: course/map, pit lane, build sheet, test track, and finish/commission panels can organize existing content without adding routes for every category.
- Establish a strong first viewport with a clear identity, what the owner does, one primary action, one secondary action, and an obvious navigation system.
- Replace competing panels and repeated decorative treatments with a deliberate hierarchy: large editorial heading, one dominant project visual, concise explanatory copy, then technical details.
- Keep a consistent project “vehicle card/build sheet” language across showroom and case studies. Use clear page titles, section anchors, breadcrumbs/back paths, sticky section progress where useful, and direct links to important destinations.
- Use project imagery as the main visual material. Cars are the motion metaphor and design language; avoid literal stock-car imagery overwhelming the actual work.
- Audit typography scale, contrast, spacing, line lengths, image crops, metadata density, and mobile layout in actual screenshots. Resolve specific visual mismatches rather than adding more effects by default.

### Editor simplification concepts

Keep all current content editable, but make the common path simple:
- Provide a “Quick edit” home with a short checklist: profile, featured project, project details/media, experience, contact links; show completion and save status in plain language.
- Separate common fields from advanced/optional fields. Keep technical identifiers, ordering, serialization, asset linking, and schema concerns out of normal author workflow.
- Use friendly labels, examples, inline validation, useful empty states, and safe defaults. Do not ask the owner to edit raw JSON, IDs, slugs, folders, or file paths.
- Make image selection/upload visual with preview, focal/crop guidance where supported, and clear reuse from the existing media library.
- Keep save, draft, preview, and publish/visibility status persistently visible. Preview should show the changes for the selected content in context and provide a clear return to editing.
- Group portfolio content around tasks the owner understands. Use progressive disclosure rather than a long list of equally weighted technical tabs. Preserve power features under “Advanced”.
- Add a straightforward “add project” flow with a small required set (name, summary, image) and optional case-study sections that can be completed later.
- Do not replace the database CMS or invent another authoring source. Any editor work must continue through the current schema, snapshot, APIs, Prisma and media library.

## Suggested delivery milestones

Astra must inspect the current UI and source first, then revise scope based on evidence. Do not implement every concept at once.

### M0 — Evidence-led UX and visual audit
- Run the existing app and inspect desktop, tablet, mobile, owner/editor, navigation, projects, and case studies.
- Map user tasks and identify exact friction points with route/component references and screenshots.
- Check keyboard, touch, reduced motion, zoom, loading, and empty states.
- Deliver prioritized findings and an implementation plan before code changes.

### M1 — Navigation and information hierarchy
- Make primary routes and current location obvious; improve wayfinding across long pages and case studies.
- Clarify hero hierarchy and high-value actions.
- Ensure direct links to projects, experience, and contact work on desktop and mobile.

### M2 — Scroll-controlled automotive project journey
- Prototype one representative scene using existing project records/media and shared motion tokens.
- Add clear skip/browse controls, checkpoints, ordinary scroll behavior, keyboard access, mobile fallback, and reduced-motion presentation.
- Keep project details accessible without animation and preserve the existing case-study URLs.
- Verify performance and avoid unnecessary large 3D dependencies.

### M3 — Visual system and content presentation
- Refine spacing, typography, contrast, visual rhythm, imagery/crops, section transitions, and project case studies.
- Use consistent project data presentation and remove visual clutter that competes with work.

### M4 — Simple editor workflow
- Redesign editor information architecture around Quick Edit, clear completion/save status, friendly content flows, and preview.
- Preserve advanced tools and current CMS/media contracts.
- Validate creating/editing a project and updating representative content without raw JSON or manual path work.

### M5 — QA and finish
- Verify routes and anchor navigation, responsive layouts, editor save/preview, keyboard/touch interactions, reduced motion, and performance.
- Capture before/after screenshots and document remaining tradeoffs.
- Update the context/milestone docs to match the actual implementation.

## Definition of done

- A first-time visitor can identify the owner’s specialty and reach projects/contact quickly.
- Visitors can understand where they are and move through the site without guessing.
- The project journey visibly responds to natural scroll, communicates its progress, and leaves project content directly accessible.
- The car/showroom concept stays coherent while real project work remains the subject.
- Reduced-motion and mobile visitors receive a complete, usable alternative.
- The owner can make common content changes through a short, plain-language workflow with preview and clear save status.
- Existing database/content/media ownership remains the single source of truth.
- Visual claims are backed by screenshots and interaction checks; no verification is claimed without running it.

## Execution rules for Astra

1. Start by inspecting `git status` so pre-existing work is preserved.
2. Read every context file listed above before changing code.
3. Research and audit the current experience; do not assume the current portfolio is blank or rebuild from the original v2 prompt.
4. Present the concrete audit findings and milestone sequence. Then continue implementation in small coherent milestones, using judgment for routine choices and stopping only when blocked by missing credentials, destructive actions, or a genuinely consequential unresolved choice.
5. Preserve current routes, validated content schemas, database CMS, media library, security boundaries, accessibility, and reduced-motion support unless an evidence-backed change is required and documented.
6. For this preparation task, only Markdown files may be changed. For later code work, follow `AGENTS.md` and read the relevant installed Next.js guide before editing code.
7. Keep new documentation aligned with what is actually built; do not mark milestones complete based on plans.
8. Do not add automated tests unless asked; use targeted checks and real UI verification where available.

## Handoff prompt

Use the repository and this context file to complete the existing portfolio. First read all linked context, inspect current git changes, research current best practices and interaction references, then audit the live experience. Produce a prioritized, evidence-based plan for better navigation, visual hierarchy, scroll-controlled car/project motion, and a simpler content editor. After presenting the plan, implement it in small milestones, preserving the current CMS and content model. Verify each milestone in the actual interface, including mobile and reduced-motion behavior, and update the Markdown context with accurate status. The project/car should move in response to visitor scroll while all content remains directly accessible. Make common editing tasks simple, visual, and guided; keep advanced controls available behind progressive disclosure.
