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
| SpecificationRow | Dot-leader spec row | `label,value` | Server | — | [ ] |
| AngularPanel | Clipped-corner panel wrapper | `children,variant,as` | Server | — | [x] |
| Container | Responsive horizontal padding + max-width | `children,size` | Server | — | [x] *(not in original inventory — added as the shared responsive wrapper referenced throughout RESPONSIVE.md)* |
| ImageMask | Reveal-masked image | `src,alt` | Client (animated) | motion tokens | [ ] |
| ProgressIndicator | "03/08" animated counter | `current,total` | Client | motion tokens | [ ] |
| StatusIndicator | Status dot + label | `status` | Server | — | [ ] |
| ProjectShowroom | Top-level showroom state/controller | `projects` | Client | ProjectViewer, ProjectThumbnailRail | [ ] |
| ProjectViewer | Current project display + transitions | `project,direction` | Client | ImageMask, ProjectSpecs | [ ] |
| ProjectThumbnailRail | GT-style selector strip | `projects,activeIndex,onSelect` | Client | — | [ ] |
| ProjectNavigation | Prev/Next controls + keyboard/touch | `onPrev,onNext` | Client | — | [ ] |
| ProjectSpecs | Spec table for a project | `project` | Server | SpecificationRow | [ ] |
| ProjectFeature | Alternating feature block | `feature,index` | Server | Reveal | [ ] |
| ProjectGallery | Screenshot gallery | `images[]` | Server | MotionImage | [ ] |
| ProjectFiles | File list + downloads + ZIP CTA | `files[],slug` | Client (download state) | — | [ ] |
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
