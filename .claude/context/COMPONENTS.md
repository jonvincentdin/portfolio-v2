# COMPONENTS.md

Status legend: `[ ] planned  [~] in progress  [x] done`

| Component | Purpose | Key Props | Server/Client | Depends On | Status |
|---|---|---|---|---|---|
| SiteHeader | Top nav, logo, numbered links | — (delegates active-state to NavLink) | Server | NavLink, MobileNavigation | [x] |
| NavLink | Single nav link with active-state styling | `item, onClick` | Client (`usePathname`) | — | [x] *(not in original inventory — added to keep the `usePathname` client boundary minimal; SiteHeader itself stays a server component)* |
| MobileNavigation | Full-screen mobile menu | — (internal `isOpen` state) | Client | NavLink | [x] *(basic CSS-transition open/close; full motion choreography deferred to Milestone 12 per MOTION.md)* |
| Footer | Bottom links/meta | — | Server | — | [x] |
| SectionIndex | "01 / 05"-style section counter | `current,total` | Server | — | [ ] |
| SectionHeading | Uppercase heading + kicker | `kicker,title,align` | Server | TechnicalLabel | [x] |
| TechnicalLabel | Mono uppercase label | `children,accent,as` | Server | — | [x] |
| SpecificationRow | Dot-leader spec row | `label,value` | Server | TechnicalLabel | [x] |
| AngularPanel | Clipped-corner panel wrapper | `children,variant,as` | Server | — | [x] |
| Container | Responsive horizontal padding + max-width | `children,size` | Server | — | [x] *(not in original inventory — added as the shared responsive wrapper referenced throughout RESPONSIVE.md)* |
| StatusIndicator | Status dot + label | `label,tone` | Server | TechnicalLabel | [x] |
| ArrowLink | CTA link (primary/secondary) with arrow micro-interaction | `href,children,variant,external` | Server | — | [x] *(not in original inventory — added as the shared CTA pattern per DESIGN_SYSTEM.md's Buttons section; reused by Home, will be reused by Contact/showroom)* |
| Reveal | Mount or scroll-triggered fade/translate entrance | `children,className,delayMs,mode` | Client | — | [x] *(signature expanded from the original inventory: added `mode: "mount" \| "scroll"` so the same component drives both the Home page-load sequence, spec §29, and later scroll reveals, spec §38)* |
| FeaturedProject | Home's "featured build" section | `project` | Server | AngularPanel, ArrowLink, SectionHeading, TechnicalLabel, `next/image` | [x] *(not in original inventory — Home-specific composition; may be revisited to share logic with ProjectSpecs once that's built in Milestone 04)* |
| ImageMask | Reveal-masked image | `src,alt` | Client (animated) | motion tokens | [ ] |
| ProgressIndicator | "03/08" project counter with animated directional slide | `current,total,direction,className` | Client (Framer Motion) | TechnicalLabel | [x] *(Milestone 05: animated, spec §34 — was static-only in Milestone 04)* |
| StatusIndicator | Status dot + label | `status` | Server | — | [ ] |
| ProjectShowroom | Top-level showroom state/controller | `projects` | Client | ProjectViewer, ProjectThumbnailRail | [x] *(Milestone 05: added `direction` state driving the transition animation; keyboard, wrap-around next/prev unchanged from Milestone 04)* |
| ProjectViewer | Current project display + transitions | `project,index,total,direction,navigation,onSwipeNext,onSwipePrevious,swipeEnabled` | Client (Framer Motion — `motion.div` variants + `drag`) | ProjectSpecs, ProgressIndicator, AngularPanel | [x] *(Milestone 05: directional slide transition (spec §32), internal stagger, and touch/swipe via the same draggable card — was static-only in Milestone 04)* |
| ProjectThumbnailRail | GT-style selector strip | `projects,activeIndex,onSelect` | Client (Framer Motion `layoutId` for the active indicator) | — | [x] *(Milestone 05: scale/brighten on select, shared-layout active indicator (spec §33), auto-scroll into view)* |
| ProjectNavigation | Prev/Next controls + keyboard/touch | `onPrevious,onNext,disabled` | Client | — | [x] *(Milestone 04: click/tap only — keyboard lives in ProjectShowroom, touch/swipe is Milestone 05)* |
| ProjectSpecs | Spec table for a project | `project` | Server | SpecificationRow | [x] |
| ProjectFeature | Alternating feature block | `feature,index,project` | Server | AngularPanel, TechnicalLabel, Reveal | [x] *(Milestone 06)* |
| ProjectGallery | Screenshot gallery | `project` | Server | AngularPanel, TechnicalLabel | [x] *(Milestone 06; signature takes `project` rather than a bare `images[]` so it can resolve media URLs itself)* |
| ProjectFiles | File list + downloads + ZIP CTA | `project` | Server (renders the client `DownloadProjectButton`) | TechnicalLabel, DownloadProjectButton | [x] *(Milestone 06)* |
| DownloadProjectButton | Idle/preparing/building/ready ZIP download trigger | `slug,folderName,className` | Client | — | [x] *(Milestone 06, not in original inventory — the client half of ProjectFiles' download state machine, spec §46)* |
| CaseStudySection | Kicker + paragraph pattern for Overview/Problem/Objective/etc. | `label,content` | Server | TechnicalLabel, Reveal | [x] *(Milestone 06, not in original inventory)* |
| EngineeringPrinciples | Numbered principles list (About page) | — (reads `ABOUT_CONTENT`) | Server | TechnicalLabel, Reveal | [x] *(Milestone 07, not in original inventory)* |
| ServicesList | Services as vehicle-capability rows, not equal-sized cards | `services` | Server | TechnicalLabel, Reveal | [x] *(Milestone 07, not in original inventory — spec §55 didn't name a Services component explicitly)* |
| ExperienceTimeline | Work history timeline | `entries[]` | Server | Reveal | [ ] |
| EducationTimeline | Education history | `entries[]` | Server | Reveal | [ ] |
| CertificationGallery | Cert list/grid | `certs[]` | Server | — | [ ] |
| AchievementPanel | Achievement entries | `achievements[]` | Server | AngularPanel | [ ] |
| SkillDashboard | Telemetry-style skill display | `categories[]` | Server | SkillCategory | [ ] |
| SkillCategory | One category block | `category` | Server | SkillItem | [ ] |
| SkillItem | Single skill (name + level, no fake %) | `skill` | Server | — | [ ] |
| ContactForm | Name/email/subject/message + states | — | Client | — | [ ] |
| PageTransition | Route-level enter/exit motion | `children` | Client | motion tokens | [ ] |
| Reveal | Scroll-triggered reveal wrapper | `children,delay` | Client | motion tokens | [ ] |
| MotionImage | Hover scale/translate image | `src,alt` | Client | motion tokens | [ ] |

This table is the authoritative component inventory and will be updated (not
replaced) as each milestone implements its slice.
