import { z } from 'zod';

export const BlogSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(25, 'Title must not exceed 25 characters')
    .nonempty('Title is required'),
  categories: z
    .array(z.string(), { required_error: 'At least one category is required' })
    .min(1, 'Please select at least one category')
    .max(5, 'Maximum 5 categories allowed'),
  imageUrl: z
    .string({ required_error: 'Image is required' })
    .trim()
    .url('Please provide a valid image URL'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(30, 'Description must not exceed 30 characters')
    .nonempty('Description is required'),
  content: z
    .string()
    .nonempty('Content is required')
    .min(50, 'Content must be at least 50 characters long'),
});
