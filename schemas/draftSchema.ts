import { z } from "zod";

export const DraftSchema = z.object({
  name: z.string().min(2).max(15),
  content: z.string(),
});
