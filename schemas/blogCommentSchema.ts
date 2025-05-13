import { z } from 'zod';

export const BlogCommentSchema = z.object({
  content: z.string().min(5).max(50),
  blogId: z.string(),
});
