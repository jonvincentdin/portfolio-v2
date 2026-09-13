import { z } from "zod";
import { VisibilitySchema } from "./common";

export const ServiceSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().default(0),
  visible: VisibilitySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  capabilities: z.array(z.string()).default([]),
});

export type Service = z.infer<typeof ServiceSchema>;
