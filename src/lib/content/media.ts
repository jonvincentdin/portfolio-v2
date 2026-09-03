import type { LoadedProject } from "./projects";

export type { LoadedProject } from "./projects";

/**
 * Builds a URL for a project's media file, servable via the
 * /content-media/[...path] route handler (content/ lives outside public/,
 * so it can't be referenced with a plain root-relative path).
 *
 * Deliberately its own module, separate from projects.ts: this is a pure
 * string-building function used by client components (ProjectViewer,
 * ProjectThumbnailRail, and later the case study gallery). projects.ts
 * imports node:fs/node:path for filesystem discovery — if a client
 * component imported getProjectMediaUrl from that module directly, the
 * bundler would try to pull those Node built-ins into the browser bundle.
 * Splitting this out keeps client imports Node-free. The `LoadedProject`
 * type import above is erased at compile time (type-only), so it doesn't
 * reintroduce the problem. See DECISIONS.md D-012.
 */
export function getProjectMediaUrl(project: LoadedProject, relativePath: string): string {
  return `/content-media/projects/${project.folderName}/${relativePath}`;
}
