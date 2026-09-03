import { z } from "zod";

/** YYYY-MM month string, e.g. "2025-01". */
const MonthSchema = z.string().regex(/^\d{4}-\d{2}$/, "must be in YYYY-MM format");

export const ExperienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: MonthSchema,
  endDate: MonthSchema.optional(),
  current: z.boolean().default(false),
  location: z.string().min(1),
  description: z.string().default(""),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export type Experience = z.infer<typeof ExperienceSchema>;
