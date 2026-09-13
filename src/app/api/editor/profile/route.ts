import { getOwnerSession } from "@/lib/auth";
import { saveProfileImage } from "@/lib/profile";
import { databaseConfigured } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured) return Response.json({ message: "Set DATABASE_URL and run npm run db:setup first." }, { status: 503 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ message: "Choose an image file." }, { status: 400 });
    return Response.json({ ok: true, profile: await saveProfileImage(file) });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Unable to save profile image." }, { status: 400 });
  }
}
