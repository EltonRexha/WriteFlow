import { z } from 'zod';

export const BlogCommentSchema = z.object({
  content: z.string().min(5, 'Comment should have at least 5 characters').max(100, 'Comment should have the maximum of 100 characters'),
  blogId: z.string(),
});
