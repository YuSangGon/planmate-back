import { z } from "zod";
import { $ZodCheck } from "zod/v4/core";

const workPlanHotelOptionSchema = z.object({
  name: z.string().max(200).default(""),
  location: z.string().max(200).default(""),
  priceRange: z.string().max(100).default(""),
  bookingLink: z.string().max(500).optional().default(""),
  summary: z.string().max(2000).default(""),
  pros: z.array(z.string().max(100)).default([]),
  cons: z.array(z.string().max(100)).default([]),
  recommended: z.boolean().default(false),
});

const workPlanPreparationSchema = z.object({
  visaInfo: z.string().max(2000).default(""),
  documents: z.string().max(2000).default(""),
  transportToAirport: z.string().max(2000).default(""),
  simWifi: z.string().max(2000).default(""),
  moneyTips: z.string().max(2000).default(""),
  packingTips: z.string().max(2000).default(""),
  otherTips: z.string().max(2000).default(""),
});

const workPlanScheduleItemSchema = z.object({
  startTime: z.string().max(20).default(""),
  endTime: z.string().max(20).default(""),
  place: z.string().max(200).default(""),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  fee: z.string().max(100).default(""),
  estimatedCost: z.string().max(100).default(""),
  transport: z.string().max(200).default(""),
  durationNote: z.string().max(200).default(""),
  tips: z.string().max(2000).default(""),
});

const workPlanDaySchema = z.object({
  title: z.string().min(1).max(120),
  dateLabel: z.string().max(100).default(""),
  summary: z.string().max(2000).default(""),
  items: z.array(workPlanScheduleItemSchema).default([]),
});

const workPlanExtrasSchema = z.object({
  localTransport: z.string().max(2000).default(""),
  reservations: z.string().max(2000).default(""),
  emergencyInfo: z.string().max(2000).default(""),
  finalNotes: z.string().max(2000).default(""),
});

export const createPlanSchema = z.object({
  title: z.string().max(2000).default(""),
  destination: z.string().max(2000).default(""),
  summary: z.string().max(2000).default(""),
  price: z.float64().default(0),
  duration: z.string().max(2000).default(""),
  visibility: z.string().default("private"),
  tags: z.array(z.string()).default([]),
});

export const updateWorkPlanSchema = z.object({
  // planInfo: createPlanSchema,
  content: z.object({
    preparation: workPlanPreparationSchema,
    hotels: z.array(workPlanHotelOptionSchema).default([]),
    days: z.array(workPlanDaySchema).min(1),
    extras: workPlanExtrasSchema,
  }),
});

export type UpdateWorkPlanBody = z.infer<typeof updateWorkPlanSchema>;
