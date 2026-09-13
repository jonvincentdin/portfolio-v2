import { requestOwnerCode, AuthConfigurationError, AuthDeliveryError, AuthRateLimitError } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  try {
    await requestOwnerCode(ip);
    return Response.json({ ok: true, message: "If the owner email is configured, a code was sent." });
  } catch (error) {
    if (error instanceof AuthRateLimitError) return Response.json({ ok: false, message: "Please wait before requesting another code." }, { status: 429 });
    if (process.env.NODE_ENV !== "production" && error instanceof AuthConfigurationError) return Response.json({ ok: false, message: error.message }, { status: 503 });
    if (process.env.NODE_ENV !== "production" && error instanceof AuthDeliveryError) return Response.json({ ok: false, message: `${error.message} Check the server log for the Resend response.` }, { status: 503 });
    console.error("[owner-auth] OTP request failed:", error);
    return Response.json({ ok: false, message: "Verification is temporarily unavailable." }, { status: 503 });
  }
}
