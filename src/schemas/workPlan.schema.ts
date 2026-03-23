import { z } from "zod";

const planItemSchema = z.object({
  time: z.string().max(50).optional().default(""),
  title: z.string().min(1).max(120),
  note: z.string().max(500).optional().default(""),
});

const planDaySchema = z.object({
  title: z.string().min(1).max(120),
  items: z.array(planItemSchema).min(1),
});

export const updateWorkPlanSchema = z.object({
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(2000),
  duration: z.string().min(1).max(60),
  tags: z.array(z.string()).default([]),
  content: z.object({
    days: z.array(planDaySchema).min(1),
  }),
});
