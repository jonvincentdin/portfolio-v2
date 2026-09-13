import { z } from "zod";
import { RelativePathSchema, VisibilitySchema } from "./common";

export const AchievementSchema = z.object({
  id: z.string().min(1).default("achievement"),
  order: z.number().int().default(0),
  visible: VisibilitySchema,
  title: z.string().min(1),
  organization: z.string().min(1),
  date: z.string().min(1),
  description: z.string().default(""),
  image: RelativePathSchema.optional(),
});

export type Achievement = z.infer<typeof AchievementSchema>;
