import { z } from "zod";

export const songRequestSchema = z.object({
  guest_name: z.string().min(2, "Guest name is required").max(80),
  song_title: z.string().min(1, "Song title is required").max(120),
  artist: z.string().min(1, "Artist is required").max(120),
  note: z.string().max(240).optional().or(z.literal(""))
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must have at least 6 characters")
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must have at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your new password")
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"]
});

export const pollCreateSchema = z.object({
  question: z.string().min(4, "Question is required"),
  type: z.enum(["genre", "song", "custom"]),
  options: z.string().min(3, "Add at least one option"),
  is_active: z.boolean().default(true),
  starts_at: z.string().optional(),
  ends_at: z.string().optional()
});

export const crudFieldSchema = z.record(z.string().or(z.number()).or(z.boolean()).or(z.null()).or(z.array(z.string())));
