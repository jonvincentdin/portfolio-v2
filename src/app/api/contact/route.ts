import { NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/schemas/contact";
import { databaseConfigured, db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * POST /api/contact
 *
 * Validates a contact form submission server-side (never trusting the
 * client-side validation alone) using the same `ContactFormSchema` the
 * form itself pre-checks against, so the two can't drift.
 *
 * Contact submissions are persisted in PostgreSQL when the database is
 * configured. The existing log fallback keeps local development usable
 * before the database is provisioned.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = ContactFormSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return NextResponse.json({ ok: false, error: "Validation failed.", fieldErrors }, { status: 400 });
  }

  if (databaseConfigured) {
    await db.contactSubmission.create({ data: result.data });
  } else {
    console.log("Contact form submission:", result.data);
  }

  return NextResponse.json({ ok: true });
}
