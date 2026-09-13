import { logoutOwner } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  await logoutOwner();
  return Response.json({ ok: true });
}
