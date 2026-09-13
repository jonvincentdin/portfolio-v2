import path from "node:path";
import { RelativePathSchema } from "@/lib/schemas";
import { ContentFileError } from "@/lib/content/fs-utils";

const MAX_BYTES = 25 * 1024 * 1024;
const IMAGE_KINDS = new Set(["image", "hero", "thumbnail", "gallery", "feature"]);

export type ProjectUpload = { path: string; name: string; kind: string; type: string; mimeType: string; size: number; data: Buffer };

function typeFor(filePath: string) {
  const extension = path.extname(filePath).toLowerCase().slice(1);
  return ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "txt", "csv", "json", "png", "jpg", "webp", "svg", "mp4", "mov", "fig", "sketch"].includes(extension) ? extension : "other";
}

function checkImage(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/png" && buffer.subarray(0, 8).compare(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) === 0) return;
  if (mimeType === "image/jpeg" && buffer[0] === 0xff && buffer[1] === 0xd8) return;
  if (mimeType === "image/webp" && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return;
  throw new ContentFileError("Image content does not match its MIME type.");
}

export async function readProjectUpload(file: File, assetPath: string, kind: string): Promise<ProjectUpload> {
  const parsedPath = RelativePathSchema.safeParse(assetPath.replaceAll("\\", "/"));
  if (!parsedPath.success || parsedPath.data.includes("/../") || parsedPath.data.startsWith("../")) throw new ContentFileError("Asset path must stay inside the project and cannot contain '..'.");
  if (!file || file.size === 0 || file.size > MAX_BYTES) throw new ContentFileError("Project assets must be between 1 byte and 25 MB.");
  const data = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";
  if (IMAGE_KINDS.has(kind)) checkImage(data, mimeType);
  return { path: parsedPath.data, name: file.name || path.basename(parsedPath.data), kind, type: typeFor(parsedPath.data), mimeType, size: data.byteLength, data };
}
