import { z } from "zod";
import { RelativePathSchema } from "./common";

export const AchievementSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  date: z.string().min(1),
  description: z.string().default(""),
  image: RelativePathSchema.optional(),
});

export type Achievement = z.infer<typeof AchievementSchema>;
