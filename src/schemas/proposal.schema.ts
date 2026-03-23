import { z } from "zod";

export const createProposalSchema = z.object({
  message: z.string().min(10).max(1000),
  proposedPrice: z.number().int().nonnegative().optional(),
  estimatedDays: z.number().int().min(1).max(365).optional(),
});
