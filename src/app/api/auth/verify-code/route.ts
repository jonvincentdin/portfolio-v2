import { verifyOwnerCode } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let code = "";
  try { code = String((await request.json()).code ?? ""); } catch { return Response.json({ ok: false, message: "Enter the six-digit code." }, { status: 400 }); }
  if (!/^\d{6}$/.test(code) || !(await verifyOwnerCode(code))) return NextResponse.json({ ok: false, message: "That verification code is invalid or expired." }, { status: 401 });
  return NextResponse.json({ ok: true });
}
