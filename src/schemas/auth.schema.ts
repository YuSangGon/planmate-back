import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

export const passwordSchema = z.object({
  originalPassword: z.string(),
  newPassword: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
