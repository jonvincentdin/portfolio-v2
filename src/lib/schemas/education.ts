import { z } from "zod";
import { VisibilitySchema } from "./common";

export const EducationSchema = z.object({
  id: z.string().min(1).default("education"),
  order: z.number().int().default(0),
  visible: VisibilitySchema,
  institution: z.string().min(1),
  program: z.string().min(1),
  startYear: z.string().min(1),
  endYear: z.string().min(1),
  description: z.string().default(""),
  achievements: z.array(z.string()).default([]),
});

export type Education = z.infer<typeof EducationSchema>;
