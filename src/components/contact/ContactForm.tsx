"use client";

import { useState } from "react";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { cn } from "@/lib/utils/cn";
import { ContactFormSchema, type ContactFormErrors, type ContactFormValues } from "@/lib/schemas/contact";

type SubmitState = "idle" | "sending" | "success" | "error";

const EMPTY_VALUES: ContactFormValues = { name: "", email: "", subject: "", message: "" };

const FIELD_LABELS: Record<keyof ContactFormValues, string> = {
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",
};

const BUTTON_LABEL: Record<SubmitState, string> = {
  idle: "Send Message",
  sending: "Sending...",
  success: "Message Sent",
  error: "Try Again",
};

/**
 * Contact form (spec §27, §44): underlined fields rather than boxed SaaS
 * inputs, client-side validation via the same `ContactFormSchema` the API
 * route re-checks server-side, and an idle/sending/success/error state
 * machine rather than a plain "submitted" flag.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function updateField(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = ContactFormSchema.safeParse(values);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        subject: flat.subject?.[0],
        message: flat.message?.[0],
      });
      return;
    }

    setErrors({});
    setServerError(null);
    setState("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setState("success");
      setValues(EMPTY_VALUES);
    } catch {
      setState("error");
      setServerError("Something went wrong sending your message. Please try again.");
    }
  }

  const isDisabled = state === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {(["name", "email", "subject"] as const).map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <TechnicalLabel as="label" htmlFor={`contact-${field}`} className="block">
            {FIELD_LABELS[field]}
          </TechnicalLabel>
          <input
            id={`contact-${field}`}
            type={field === "email" ? "email" : "text"}
            value={values[field]}
            onChange={(event) => updateField(field, event.target.value)}
            disabled={isDisabled}
            className={cn(
              "w-full border-b bg-transparent py-2 font-body text-body-md text-foreground-primary outline-none transition-colors duration-150 placeholder:text-foreground-muted/50 focus:border-accent",
              errors[field] ? "border-red-400" : "border-border",
            )}
          />
          {errors[field] ? (
            <p className="font-technical text-technical-label uppercase tracking-[0.08em] text-red-400">
              {errors[field]}
            </p>
          ) : null}
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <TechnicalLabel as="label" htmlFor="contact-message" className="block">
          Message
        </TechnicalLabel>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          disabled={isDisabled}
          className={cn(
            "w-full resize-none border-b bg-transparent py-2 font-body text-body-md text-foreground-primary outline-none transition-colors duration-150 focus:border-accent",
            errors.message ? "border-red-400" : "border-border",
          )}
        />
        {errors.message ? (
          <p className="font-technical text-technical-label uppercase tracking-[0.08em] text-red-400">
            {errors.message}
          </p>
        ) : null}
      </div>

      {state === "error" && serverError ? (
        <p className="font-technical text-technical-label uppercase tracking-[0.08em] text-red-400">
          {serverError}
        </p>
      ) : null}

      {state === "success" ? (
        <p className="font-technical text-technical-label uppercase tracking-[0.08em] text-accent">
          Thanks — I&apos;ll get back to you soon.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isDisabled}
        className="group inline-flex w-fit items-center gap-3 bg-accent px-6 py-3 font-technical text-technical-label uppercase tracking-[0.1em] text-accent-foreground transition-colors duration-150 hover:bg-accent/90 disabled:cursor-default disabled:opacity-80"
      >
        {BUTTON_LABEL[state]}
        {state === "idle" ? (
          <span
            className="inline-block transition-transform duration-150 group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        ) : null}
      </button>
    </form>
  );
}
