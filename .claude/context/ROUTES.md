# ROUTES.md

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Home — hero, intro, CTAs, featured project | Server, static |
| `/about` | About Me + Services + Skills | Server, static |
| `/projects` | GT-style project showroom (all projects) | Server shell, Client showroom |
| `/projects/[slug]` | Individual project case study + files | Server, `generateStaticParams()` from loader |
| `/experience` | Experience + Education + Certifications + Achievements | Server, static |
| `/contact` | Contact form + social links | Server shell, Client form |
| `/api/projects/[slug]/download` | Streams full project folder as ZIP | Route handler (Node runtime) |

## Notes
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
