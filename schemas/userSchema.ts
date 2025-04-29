import {z} from 'zod';

export const userSchema = z.object({
    email: z.string().email().nonempty("Email is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must not exceed 20 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
    name: z.string().nonempty("Name is required"),
    image: z.string().url("Image must be a valid URL").optional(),
});