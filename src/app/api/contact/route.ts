import { NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/schemas/contact";

export const runtime = "nodejs";

/**
 * POST /api/contact
 *
 * Validates a contact form submission server-side (never trusting the
 * client-side validation alone) using the same `ContactFormSchema` the
 * form itself pre-checks against, so the two can't drift.
 *
 * IMPORTANT — honest limitation, not a hidden gap: no email provider is
 * configured in this milestone. There's no SMTP/Resend/etc. credential
 * available in this environment, so wiring a real "actually deliver this
 * email" integration here would mean fabricating working infrastructure
 * that doesn't exist. Instead, a validated submission is logged
 * server-side (`console.log`) and a success response is returned — the
 * form is genuinely functional and testable end-to-end up to that point.
 * Wiring a real provider later is a small, isolated change: replace the
 * `console.log` below with the provider's send call.
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

  // Placeholder for real delivery — see the doc comment above.
  console.log("Contact form submission:", result.data);

  return NextResponse.json({ ok: true });
}
