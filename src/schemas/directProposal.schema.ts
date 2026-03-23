import { z } from "zod";

export const createDirectProposalSchema = z.object({
  title: z.string().min(1).max(120),
  destination: z.string().min(1).max(120),
  duration: z.string().min(1).max(60),
  budget: z.string().min(1).max(60),
  travelStyle: z.string().min(1).max(300),
  interests: z.array(z.string()).min(1),
  extraNotes: z.string().optional(),
});
