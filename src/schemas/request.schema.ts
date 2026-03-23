import { z } from "zod";

export const createRequestSchema = z.object({
  destination: z.string().min(1).max(120),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.string().min(1).max(60),
  budget: z.string().min(1).max(60),
  offerCost: z.number().int().min(0),
  travelStyle: z.string().min(1).max(300),
  interests: z.array(z.string()).min(1),
  extraNotes: z.string().optional(),
});
