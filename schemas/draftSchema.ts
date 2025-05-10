import { z } from 'zod';

export const DraftSchema = z.object({
  name: z.string().min(2).max(10),
  content: z.string(),
});
