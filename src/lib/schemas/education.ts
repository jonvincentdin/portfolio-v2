import { z } from "zod";

export const EducationSchema = z.object({
  institution: z.string().min(1),
  program: z.string().min(1),
  startYear: z.string().min(1),
  endYear: z.string().min(1),
  description: z.string().default(""),
  achievements: z.array(z.string()).default([]),
});

export type Education = z.infer<typeof EducationSchema>;
