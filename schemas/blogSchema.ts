import { z } from "zod";

export const BlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must not exceed 50 characters")
    .nonempty("Title is required"),
  categories: z
    .array(z.string(), { required_error: "At least one category is required" })
    .min(1, "Please select at least one category")
    .max(5, "Maximum 5 categories allowed"),
  imageUrl: z
    .string({ required_error: "Image is required" })
    .trim()
    .url("Please provide a valid image URL"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(200, "Description must not exceed 200 characters")
    .nonempty("Description is required"),
  content: z
    .string()
    .nonempty("Content is required")
    .min(50, "Blog content must be at least 50 characters long"),
});

export const BlogSchemaForm = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must not exceed 50 characters")
    .nonempty("Title is required"),
  categories: z
    .array(z.string(), { required_error: "At least one category is required" })
    .min(1, "Please select at least one category")
    .max(5, "Maximum 5 categories allowed"),
  imageUrl: z
    .string({ required_error: "Image is required" })
    .trim()
    .url("Please provide a valid image URL"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(200, "Description must not exceed 200 characters")
    .nonempty("Description is required"),
});
