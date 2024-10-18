import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    userName: z
      .string({ required_error: 'Username is required' })
      .trim()
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(50, { message: 'Username must not exceed 50 characters' }),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Invalid email address' })
      .min(3, { message: 'Email must be at least 3 characters long' })
      .max(255, { message: 'Email must not exceed 255 characters' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(5, { message: 'Password must be at least 5 characters' })
      .max(25, { message: "Password can't exceed 25 characters" }),
  }),
});

export const uuidSchema = z.object({
  params: z.object({
    userId: z
      .string({ required_error: 'userId is required' })
      .uuid('Invalid userId format'),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1))
      .refine((val) => val > 0, { message: 'Page must be a positive number' }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10))
      .refine((val) => val > 0, { message: 'Limit must be a positive number' }),
    search: z.string().optional(),
  }),
});
