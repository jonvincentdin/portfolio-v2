"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

export function OwnerVerification() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "code">("request");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function requestCode() {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch("/api/auth/request-code", { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to request a code.");
      setStep("code"); setMessage(body.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to request a code."); }
    finally { setBusy(false); }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      const response = await fetch("/api/auth/verify-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "The code was not accepted.");
      router.push("/editor");
    } catch (error) { setMessage(error instanceof Error ? error.message : "The code was not accepted."); }
    finally { setBusy(false); }
  }

  return (
    <AngularPanel className="mx-auto max-w-xl p-6 sm:p-10">
      <TechnicalLabel accent as="div">Owner Verification</TechnicalLabel>
      <h1 className="mt-4 font-heading text-display-md uppercase tracking-tight">Private access.</h1>
      <p className="mt-4 max-w-md font-body text-body-md text-foreground-muted">
        Send a secure one-time code to the configured owner email. The address is never shown here.
      </p>

      {step === "request" ? (
        <button type="button" onClick={requestCode} disabled={busy} className="mt-8 w-full bg-accent px-5 py-4 font-technical text-technical-label uppercase tracking-[0.1em] text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
          {busy ? "Requesting..." : "Send Verification Code"}
        </button>
      ) : (
        <form onSubmit={verifyCode} className="mt-8 flex flex-col gap-4">
          <label htmlFor="owner-code" className="font-technical text-technical-label uppercase tracking-[0.1em]">Six-digit code</label>
          <input id="owner-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required className="w-full border-b border-border-strong bg-transparent px-0 py-3 font-technical text-heading-md tracking-[0.3em] focus-visible:border-accent focus-visible:outline-none" />
          <div className="flex flex-wrap gap-4">
            <button type="submit" disabled={busy || code.length !== 6} className="bg-accent px-5 py-3 font-technical text-technical-label uppercase tracking-[0.1em] text-accent-foreground disabled:opacity-50">{busy ? "Checking..." : "Verify"}</button>
            <button type="button" onClick={() => { setStep("request"); setMessage(null); }} className="px-2 py-3 font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-muted hover:text-foreground-primary">Start over</button>
          </div>
        </form>
      )}
      <p role="status" aria-live="polite" className="mt-6 min-h-5 font-technical text-technical-label uppercase tracking-[0.08em] text-accent">{message}</p>
    </AngularPanel>
  );
}
