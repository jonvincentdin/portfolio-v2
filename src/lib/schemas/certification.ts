import { z } from "zod";
import { OptionalLinkSchema, RelativePathSchema, VisibilitySchema } from "./common";

export const CertificationSchema = z.object({
  id: z.string().min(1).default("certification"),
  order: z.number().int().default(0),
  visible: VisibilitySchema,
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  credentialId: z.string().default(""),
  credentialUrl: OptionalLinkSchema,
  image: RelativePathSchema.optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;
