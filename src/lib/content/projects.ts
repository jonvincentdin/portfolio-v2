import fs from "node:fs";
import path from "node:path";
import {
  CONTENT_ROOT,
  ContentValidationError,
  assertFileExists,
  getFileSizeBytes,
  listDirectories,
  parseOrThrow,
  readJsonFile,
} from "./fs-utils";
import { ProjectSchema, type Project, type ProjectFile } from "@/lib/schemas";

const PROJECTS_DIR = path.join(CONTENT_ROOT, "projects");

/**
 * A loaded project plus the folder name it was discovered under.
 * `folderName` (e.g. "001-memora") is kept separate from `slug` ("memora")
 * because the ZIP download system (Milestone 06) must resolve and name
 * downloads from the real directory on disk, not the URL-facing slug.
 */
export type LoadedProject = Project & { folderName: string };

let cache: LoadedProject[] | null = null;

/** Absolute path to a project's directory on disk, given its folder name. */
export function getProjectDirectoryPath(folderName: string): string {
  return path.join(PROJECTS_DIR, folderName);
}

function loadOneProject(folderName: string): LoadedProject {
  const projectDir = getProjectDirectoryPath(folderName);
  const jsonPath = path.join(projectDir, "project.json");
  const source = `content/projects/${folderName}/project.json`;

  if (!fs.existsSync(jsonPath)) {
    throw new ContentValidationError(
      source,
      `  - project.json: expected a project.json file inside "content/projects/${folderName}/"`,
    );
  }

  const raw = readJsonFile(jsonPath);
  const project = parseOrThrow(ProjectSchema, raw, source);

  // Verify every referenced media/file path actually exists on disk
  // (spec §66 — a missing reference must produce a clear developer error
  // naming the folder, the field, and the path).
  assertFileExists(
    path.join(projectDir, project.media.hero),
    `${source} → media.hero`,
  );
  assertFileExists(
    path.join(projectDir, project.media.thumbnail),
    `${source} → media.thumbnail`,
  );
  project.media.gallery.forEach((galleryPath, index) => {
    assertFileExists(
      path.join(projectDir, galleryPath),
      `${source} → media.gallery[${index}]`,
    );
  });
  project.files.forEach((file: ProjectFile, index: number) => {
    assertFileExists(
      path.join(projectDir, file.path),
      `${source} → files[${index}].path`,
    );
  });

  return { ...project, folderName };
}

function extractFolderPrefix(folderName: string): number {
  const match = folderName.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

function sortProjects(projects: LoadedProject[]): LoadedProject[] {
  return [...projects].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    const prefixDiff = extractFolderPrefix(a.folderName) - extractFolderPrefix(b.folderName);
    if (prefixDiff !== 0) return prefixDiff;
    return b.year - a.year;
  });
}

/**
 * Discovers, validates, and returns every project under content/projects/.
 * Adding a new folder here is the entire authoring workflow — no code
 * changes anywhere else (spec §17, §72).
 */
export function getAllProjects(): LoadedProject[] {
  if (cache) return cache;

  const folderNames = listDirectories(PROJECTS_DIR);
  const projects = folderNames.map(loadOneProject);

  // Slugs are used for routing (/projects/[slug]) and must be unique.
  const seenSlugs = new Map<string, string>();
  for (const project of projects) {
    const existingFolder = seenSlugs.get(project.slug);
    if (existingFolder) {
      throw new ContentValidationError(
        `content/projects/${project.folderName}/project.json`,
        `  - slug: "${project.slug}" is already used by content/projects/${existingFolder}/project.json — slugs must be unique`,
      );
    }
    seenSlugs.set(project.slug, project.folderName);
  }

  cache = sortProjects(projects);
  return cache;
}

/** Looks up a single project by its URL slug, or undefined if none matches. */
export function getProjectBySlug(slug: string): LoadedProject | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

/** All featured projects, in the same sorted order as getAllProjects(). */
export function getFeaturedProjects(): LoadedProject[] {
  return getAllProjects().filter((project) => project.featured);
}

/**
 * Derives a project file's size on disk in bytes. Sizes are never hand-
 * maintained in project.json (spec §68) — always computed here from the
 * real file.
 */
export function getProjectFileSizeBytes(project: LoadedProject, file: ProjectFile): number | null {
  const projectDir = getProjectDirectoryPath(project.folderName);
  return getFileSizeBytes(path.join(projectDir, file.path));
}
