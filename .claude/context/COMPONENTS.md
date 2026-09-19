# COMPONENTS.md

## Owner Editor + Database Components
`OwnerVerification`, `EditorShell`, `EditorPreview`, `ProfileUploader`,
`CollectionEditor`, and `ProjectEditor` are implemented. The editor uses
structured fields instead of raw JSON, while project asset controls upload
binary files to PostgreSQL. The preview uses the public AngularPanel/typography
system; all server-side upload and snapshot validation remains authoritative.
`MediaLibrary` provides reusable asset upload/list/delete controls, and
`ProjectEditor` can link a library asset to a project path.

Status legend: `[ ] planned  [~] in progress  [x] done`

| Component | Purpose | Key Props | Server/Client | Depends On | Status |
|---|---|---|---|---|---|
| SiteHeader | Top nav, logo, numbered links | — (delegates active-state to NavLink) | Server | NavLink, MobileNavigation | [x] *(Milestone 13: desktop `<nav>` given `aria-label="Primary"` to disambiguate it from the mobile menu's `<nav>` — see DECISIONS.md D-035)* |
| NavLink | Single nav link with active-state styling | `item, onClick, linkRef` | Client (`usePathname`) | — | [x] *(not in original inventory — added to keep the `usePathname` client boundary minimal; SiteHeader itself stays a server component. Milestone 13: fixed a real color-contrast failure — the index number used `text-foreground-muted/60`, measuring 2.73:1, well under WCAG's 4.5:1; now full-opacity `text-foreground-muted` at 5.73:1. Also gained an optional `linkRef` so `MobileNavigation` can focus-manage its first link.)* |
| MobileNavigation | Full-screen mobile menu | — (internal `isOpen` state) | Client | NavLink, `react-dom`'s `createPortal` | [x] *(Milestone 11: rendered via a portal into `document.body` — see DECISIONS.md D-024. Milestone 12: `active:scale-90` press state on the hamburger. Milestone 13: full dialog semantics — `role="dialog"`, `aria-modal`, `aria-hidden` toggled with open state, a real focus trap, Escape-to-close, focus returned to the trigger on close, and a distinct `aria-label="Mobile"` on its `<nav>` — see DECISIONS.md D-035.)* |
| Footer | Bottom links/meta | — | Server | — | [x] |
| SectionIndex | "01 / 05"-style section counter | `current,total` | Server | — | [ ] |
| SectionHeading | Uppercase heading + kicker | `kicker,title,align` | Server | TechnicalLabel | [x] |
| TechnicalLabel | Mono uppercase label | `children,accent,as,htmlFor` | Server | — | [x] *(Milestone 10 added `as="label"`+`htmlFor` for form labels. Milestone 13 added `as="h2"`: several major section titles — About's Engineering Principles/Services/Development Systems, Experience's Work History/Education/Certifications/Achievements, the case study's Features — now render as real `<h2>` elements instead of styled `<div>`s, fixing a real heading-hierarchy violation found by `axe-core`; see DECISIONS.md D-034. Visual styling is unchanged either way.)* |
| SpecificationRow | Dot-leader spec row | `label,value` | Server | TechnicalLabel | [x] |
| AngularPanel | Clipped-corner panel wrapper | `children,variant,as` | Server | — | [x] *(Milestone 14: shared `angular-panel` hook adds a small accent registration mark to reinforce the system's technical hierarchy without adding another component or animation.)* |
| Container | Responsive horizontal padding + max-width | `children,size` | Server | — | [x] *(not in original inventory — added as the shared responsive wrapper referenced throughout RESPONSIVE.md)* |
| StatusIndicator | Status dot + label | `label,tone` | Server | TechnicalLabel | [x] |
| ArrowLink | CTA link (primary/secondary) with arrow micro-interaction | `href,children,variant,external` | Server | — | [x] *(not in original inventory — added as the shared CTA pattern per DESIGN_SYSTEM.md's Buttons section; reused by Home, will be reused by Contact/showroom)* |
| Reveal | Mount or scroll-triggered fade/translate entrance | `children,className,delayMs,mode` | Client | — | [x] *(signature expanded from the original inventory: added `mode: "mount" \| "scroll"` so the same component drives both the Home page-load sequence, spec §29, and later scroll reveals, spec §38)* |
| FeaturedProject | Home's "featured build" section | `project` | Server | AngularPanel, ArrowLink, SectionHeading, TechnicalLabel, `next/image` | [x] *(not in original inventory — Home-specific composition; may be revisited to share logic with ProjectSpecs once that's built in Milestone 04)* |
| ImageMask | Clip-path wipe reveal for hero-level images | `children,className` | Client (manual `IntersectionObserver`, not `whileInView` — see DECISIONS.md D-027) | motion tokens | [x] *(Milestone 12 — used only for Home's Featured Project image and the case study hero image; deliberately not applied elsewhere, see D-029)* |
| ProgressIndicator | "03/08" project counter with animated directional slide | `current,total,direction,className` | Client (Framer Motion) | TechnicalLabel | [x] *(Milestone 05: animated, spec §34 — was static-only in Milestone 04)* |
| StatusIndicator | Status dot + label | `status` | Server | — | [ ] |
| ProjectShowroom | Top-level showroom state/controller | `projects` | Client | ProjectViewer, ProjectThumbnailRail | [x] *(Milestone 05: added `direction` state driving the transition animation; keyboard, wrap-around next/prev unchanged from Milestone 04)* |
| ProjectViewer | Current project display + transitions | `project,index,total,direction,navigation,onSwipeNext,onSwipePrevious,swipeEnabled` | Client (Framer Motion — `motion.div` variants + `drag`) | ProjectSpecs, ProgressIndicator, AngularPanel | [x] *(Milestone 05: directional slide transition (spec §32), internal stagger, and touch/swipe via the same draggable card. Milestone 11: image column stretches to fill its grid row-span on `lg+` instead of a fixed aspect ratio, fixing an image/metadata-column height mismatch — see DECISIONS.md D-023.)* |
| ProjectThumbnailRail | GT-style selector strip | `projects,activeIndex,onSelect` | Client (Framer Motion `layoutId` for the active indicator) | — | [x] *(Milestone 05: scale/brighten on select, shared-layout active indicator (spec §33). Milestone 11: fixed an initial-mount `scrollIntoView` call that was auto-scrolling the entire page ~360px on every load of `/projects` — now skips the first run and scrolls the rail's own container directly; see DECISIONS.md D-025.)* |
| ProjectNavigation | Prev/Next controls + keyboard/touch | `onPrevious,onNext,disabled` | Client | — | [x] *(Milestone 04: click/tap only — keyboard lives in ProjectShowroom, touch/swipe is Milestone 05)* |
| ProjectSpecs | Spec table for a project | `project` | Server | SpecificationRow | [x] |
| ProjectFeature | Alternating feature block | `feature,index,project` | Server | AngularPanel, TechnicalLabel, Reveal | [x] *(Milestone 06)* |
| ProjectGallery | Screenshot gallery | `project` | Server | AngularPanel, TechnicalLabel | [x] *(Milestone 06; signature takes `project` rather than a bare `images[]` so it can resolve media URLs itself)* |
| ProjectFiles | File list + downloads + ZIP CTA | `project` | Server (renders the client `DownloadProjectButton`) | TechnicalLabel, DownloadProjectButton | [x] *(Milestone 06; Milestone 14: long filenames and download actions now wrap safely on narrow screens.)* |
| DownloadProjectButton | Idle/preparing/building/ready ZIP download trigger | `slug,folderName,className` | Client | — | [x] *(Milestone 06, not in original inventory — the client half of ProjectFiles' download state machine, spec §46)* |
| CaseStudySection | Kicker + paragraph pattern for Overview/Problem/Objective/etc. | `label,content` | Server | TechnicalLabel, Reveal | [x] *(Milestone 06, not in original inventory)* |
| EngineeringPrinciples | Numbered principles list (About page) | — (reads `ABOUT_CONTENT`) | Server | TechnicalLabel, Reveal | [x] *(Milestone 07, not in original inventory)* |
| ServicesList | Services as vehicle-capability rows, not equal-sized cards | `services` | Server | TechnicalLabel, Reveal | [x] *(Milestone 07, not in original inventory — spec §55 didn't name a Services component explicitly)* |
| ExperienceTimeline | Work history timeline | `entries` | Client (Framer Motion `useScroll` for the growing line) | Reveal, TechnicalLabel | [x] *(Milestone 09 — scroll-linked line growth per spec §42, see DECISIONS.md D-019)* |
| EducationTimeline | Selectable education progression and detail panel | `entries` | Client | TechnicalLabel, AudioEngine, CursorEngine | [x] *(Milestone 14 — horizontal progression on desktop, deliberate vertical journey on mobile)* |
| CertificationGallery | Selectable credential list/grid | `certifications` | Server | CredentialCard, Reveal | [x] *(Milestone 16)* |
| AchievementPanel | Selectable achievement list/grid | `achievements` | Server | CredentialCard, Reveal | [x] *(Milestone 16)* |
| SkillDashboard | Telemetry-style skill display | `categories` | Server | Reveal, SkillCategory | [x] *(Milestone 08)* |
| SkillCategory | Expandable skill cluster with featured technology chips | `category` | Client | AngularPanel, TechnicalLabel, SkillItem | [x] *(Milestone 15)* |
| SkillItem | Single skill (name + level, no fake %) | `skill` | Server | — | [x] *(Milestone 08 — discrete 5-segment bar keyed to the SkillLevel enum's real ordinal rank, never a percentage; see DECISIONS.md D-018)* |
| ContactForm | Name/email/subject/message + idle/sending/success/error states | — (self-contained) | Client | TechnicalLabel, `lib/schemas/contact.ts` | [x] *(Milestone 10 — validates client-side with the same Zod schema the API route re-validates server-side; see DECISIONS.md D-020)* |
| PageTransition | Persistent `AnimatePresence` wrapper for route transitions | `children` | Client | `app/template.tsx` | [x] *(Milestone 12 — rendered once in `layout.tsx`; the actual enter/exit variants live in `app/template.tsx`, not here — see DECISIONS.md D-026 for why the split is required)* |
| Template (`app/template.tsx`) | Route-level enter/exit motion.div (spec §31) | `children` | Client | motion tokens | [x] *(Milestone 12 — not in original inventory under this name; Next.js's `template.tsx` convention guarantees a fresh instance per navigation, which `PageTransition`'s `AnimatePresence` needs)* |
| ScrollRestoration | New-route top reset with hash and history preservation | — | Client | `usePathname`, browser history | [x] *(Milestone 03 — pathname changes reset new entries, same-page hashes remain native, and popstate preserves back/forward positions)* |
| ScrollProgress | Passive telemetry-style page progress indicator | — | Client | `usePathname`, `requestAnimationFrame` | [x] *(Milestone 04 — synchronized to natural document scroll, simplified on mobile, hidden in the owner/editor surfaces)* |
| MotionImage | Hover scale/translate image | `src,alt` | Client | motion tokens | [ ] *(deliberately not built — the two real usages of hover-scale imagery use a simple inline Tailwind `hover:scale-[1.02]` instead; see DECISIONS.md D-029)* |

This table is the authoritative component inventory and will be updated (not
replaced) as each milestone implements its slice.

## Visual Experience Continuation Components

| Component | Purpose | Key Props | Server/Client | Status |
|---|---|---|---|---|
| CursorEngine | Fine-pointer cursor core/outer/trail/glow/label layers with contextual states | `settings` | Client | [x] |
| AudioEngine | Central optional interaction audio, preview events, mute persistence, and asset fallback | `settings` | Client | [x] |
| HeroExperience | Pointer-driven CSS studio lighting and technical grid around the existing Home hero | `children` | Client | [x] |
| ProjectInteractiveFrame | Pointer-light and restrained depth response for project media | `children,className` | Client | [x] *(Milestone 12)* |
| CredentialCard | Controlled credential selection with optional image/depth response | `kind,title,organization,date,...` | Client | AngularPanel, ArrowLink, shared media URL helper | [x] *(Milestone 16)* |
| SiteExperienceEditor | Cursor Designer and Audio controls under the existing editor snapshot | `value,onChange` | Client | [x] |
| ScrollRestoration | New-route top reset with hash/history handling | — | Client | [x] |
| ScrollProgress | Passive route-aware document progress indicator | — | Client | [x] |
