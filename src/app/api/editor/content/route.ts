import { revalidatePath } from "next/cache";
import { getOwnerSession } from "@/lib/auth";
import { DatabaseNotConfiguredError, getEditorSnapshot, saveEditorSnapshot } from "@/lib/content/editor";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  return Response.json(await getEditorSnapshot());
}

export async function POST(request: Request) {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const snapshot = await saveEditorSnapshot(await request.json());
    revalidatePath("/", "layout");
    return Response.json({ ok: true, savedAt: new Date().toISOString(), content: snapshot });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") return Response.json({ message: "Validation failed", issues: (error as { issues?: unknown }).issues ?? [] }, { status: 400 });
    if (error instanceof DatabaseNotConfiguredError) return Response.json({ message: error.message }, { status: 503 });
    return Response.json({ message: error instanceof Error ? error.message : "Unable to save content." }, { status: 400 });
  }
}
