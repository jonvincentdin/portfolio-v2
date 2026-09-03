import fs from "node:fs";
import path from "node:path";
import type { ZodType } from "zod";

/**
 * Shared plumbing for the content-loader pattern described in
 * ARCHITECTURE.md: readdir/readFile -> JSON.parse -> Schema.safeParse ->
 * sort -> return typed data. Every loader in lib/content/ builds on these
 * primitives so the discover/validate/error-message shape stays identical
 * across content types.
 */

export const CONTENT_ROOT = path.join(process.cwd(), "content");

/** Thrown when JSON content fails schema validation. Developer-facing. */
export class ContentValidationError extends Error {
  constructor(source: string, issues: string) {
    super(`Invalid content in "${source}":\n${issues}`);
    this.name = "ContentValidationError";
  }
}

/** Thrown for filesystem-level problems: bad JSON, missing referenced files. */
export class ContentFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentFileError";
  }
}

function formatIssues(issues: { path: PropertyKey[]; message: string }[]): string {
  return issues
    .map((issue) => `  - ${issue.path.map(String).join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

/** Validate `data` against `schema`; throws ContentValidationError naming `source` and the failing field(s) on failure (spec §66). */
export function parseOrThrow<T>(schema: ZodType<T>, data: unknown, source: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ContentValidationError(source, formatIssues(result.error.issues));
  }
  return result.data;
}

/** Subdirectory names of `dir`, sorted. Returns [] if `dir` doesn't exist (empty content is valid, spec §74). */
export function listDirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** `.json` file names (not paths) directly inside `dir`, sorted. Returns [] if `dir` doesn't exist. */
export function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
}

/** Reads and JSON.parses a file, raising a ContentFileError naming the path on malformed JSON. */
export function readJsonFile(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new ContentFileError(
      `Malformed JSON at "${filePath}": ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

/** Asserts a referenced file exists on disk; throws a ContentFileError naming both the source reference and the missing path (spec §66). */
export function assertFileExists(filePath: string, referencedFrom: string): void {
  if (!fs.existsSync(filePath)) {
    throw new ContentFileError(
      `Referenced file does not exist.\n  Referenced from: ${referencedFrom}\n  Missing file: ${filePath}`,
    );
  }
}

/** File size in bytes, or null if the file can't be stat'd. Used to derive (never hand-maintain) displayed file sizes (spec §68). */
export function getFileSizeBytes(filePath: string): number | null {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return null;
  }
}

/** Formats a byte count as a human-readable KB/MB string for the ProjectFiles UI. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}

/**
 * Generic "one JSON file per item" loader, reused by every simple content
 * type (experience, education, certifications, achievements, services,
 * skills). Projects use their own loader (lib/content/projects.ts) since a
 * project is a folder, not a single file — see CONTENT_SYSTEM.md.
 */
export function loadJsonCollection<T>(dirName: string, schema: ZodType<T>): T[] {
  const dir = path.join(CONTENT_ROOT, dirName);
  return listJsonFiles(dir).map((fileName) => {
    const filePath = path.join(dir, fileName);
    const data = readJsonFile(filePath);
    return parseOrThrow(schema, data, `content/${dirName}/${fileName}`);
  });
}
