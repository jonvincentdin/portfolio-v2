import { getProfileFile } from "@/lib/profile";

export const runtime = "nodejs";

export async function GET() {
  const result = await getProfileFile();
  if (!result) return new Response("Profile image not found", { status: 404 });
  const contentType = result.profile.format === "jpg" ? "image/jpeg" : `image/${result.profile.format}`;
  return new Response(new Uint8Array(result.data), { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=60, must-revalidate" } });
}
