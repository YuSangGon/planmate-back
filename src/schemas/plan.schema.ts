import { z } from "zod";

export const createPlanSchema = z.object({
  requestId: z.string().optional(),
  travellerId: z.string().optional(),
  title: z.string().min(1),
  destination: z.string().min(1),
  summary: z.string().min(1),
  price: z.number().nonnegative(),
  duration: z.string().min(1),
  visibility: z.enum(["public", "private"]),
  tags: z.array(z.string()).default([]),
});
