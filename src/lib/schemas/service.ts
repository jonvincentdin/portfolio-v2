import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  capabilities: z.array(z.string()).default([]),
});

export type Service = z.infer<typeof ServiceSchema>;
