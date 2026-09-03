import { z } from "zod";
import { OptionalLinkSchema, RelativePathSchema } from "./common";

export const CertificationSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  credentialId: z.string().default(""),
  credentialUrl: OptionalLinkSchema,
  image: RelativePathSchema.optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;
