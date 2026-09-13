import { db } from "@/lib/db";
import { ContentFileError } from "@/lib/content/fs-utils";

const MAX_BYTES = 5 * 1024 * 1024;
export type ProfileImage = { url: string; width: number; height: number; format: "jpg" | "png" | "webp" };

function dimensions(buffer: Buffer, format: ProfileImage["format"]): [number, number] | null {
  if (format === "png" && buffer.length >= 24) return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  if (format === "jpg") {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1]; const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return [buffer.readUInt16BE(offset + 7), buffer.readUInt16BE(offset + 5)];
      offset += 2 + length;
    }
  }
  if (format === "webp" && buffer.toString("ascii", 12, 16) === "VP8X" && buffer.length >= 30) return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
  return null;
}

function identify(buffer: Buffer, name: string, mime: string): ProfileImage["format"] | null {
  const extension = name.toLowerCase().split(".").pop();
  const format = extension === "jpeg" || extension === "jpg" ? "jpg" : extension;
  if (!["jpg", "png", "webp"].includes(format ?? "") || !["image/jpeg", "image/png", "image/webp"].includes(mime)) return null;
  if (format === "jpg" && !(buffer[0] === 0xff && buffer[1] === 0xd8)) return null;
  if (format === "png" && buffer.subarray(0, 8).compare(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) !== 0) return null;
  if (format === "webp" && (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP")) return null;
  return format as ProfileImage["format"];
}

export async function getProfileImage(): Promise<ProfileImage | null> {
  if (!process.env.DATABASE_URL?.trim()) return null;
  const row = await db.profileImage.findUnique({ where: { id: "default" } });
  return row ? { url: "/profile-media", width: row.width, height: row.height, format: row.format as ProfileImage["format"] } : null;
}

export async function saveProfileImage(file: File): Promise<ProfileImage> {
  if (!file || file.size === 0 || file.size > MAX_BYTES) throw new ContentFileError("Profile image must be between 1 byte and 5 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const format = identify(buffer, file.name, file.type);
  if (!format) throw new ContentFileError("Profile image must be a valid JPG, PNG, or WEBP file.");
  const size = dimensions(buffer, format);
  if (!size || size[0] < 200 || size[1] < 200 || size[0] > 6000 || size[1] > 6000) throw new ContentFileError("Profile image dimensions must be between 200 and 6000 pixels.");
  const row = await db.profileImage.upsert({ where: { id: "default" }, update: { width: size[0], height: size[1], format, mimeType: file.type, size: buffer.byteLength, data: buffer }, create: { id: "default", width: size[0], height: size[1], format, mimeType: file.type, size: buffer.byteLength, data: buffer } });
  return { url: "/profile-media", width: row.width, height: row.height, format: row.format as ProfileImage["format"] };
}

export async function getProfileFile() {
  if (!process.env.DATABASE_URL?.trim()) return null;
  const row = await db.profileImage.findUnique({ where: { id: "default" } });
  return row ? { profile: { url: "/profile-media", width: row.width, height: row.height, format: row.format as ProfileImage["format"] }, data: row.data } : null;
}
