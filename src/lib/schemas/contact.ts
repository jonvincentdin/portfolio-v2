import { z } from "zod";

/**
 * Contact form validation. Not one of the seven content types in
 * CONTENT_SYSTEM.md — this validates a runtime form submission, not
 * filesystem content — but reuses the same Zod-as-single-source-of-truth
 * pattern (PROJECT.md's "Discover and validate content dynamically") for
 * both the client-side pre-submit check and the API route's server-side
 * validation, so the two can never drift out of sync.
 */
export const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  subject: z.string().min(1, "Subject is required."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
