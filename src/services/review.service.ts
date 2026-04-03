import { prisma } from "../lib/prisma";
import type {
  PlannerReview,
  PlannerReviewSummary,
  ReviewType,
} from "../types/review";
import {
  refreshPlannerReviewSummary,
  refreshPlanReviewSummary,
} from "./plannerReviewSummary.service";

function validateRating(value: number, fieldName: string) {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`${fieldName} must be an integer between 1 and 5`);
  }
}

function validateReview(input: PlannerReview) {
  validateRating(input.planQuality, "planQuality");
  validateRating(input.communication, "communication");
  validateRating(input.timeliness, "timeliness");
  validateRating(input.personalisation, "personalisation");
  validateRating(input.practicality, "practicality");
  validateRating(input.detailLevel, "detailLevel");
}

function validatePlanReview(input: ReviewType) {
  validateRating(input.planQuality, "planQuality");
  validateRating(input.practicality, "practicality");
  validateRating(input.detailLevel, "detailLevel");
}

export async function createReviewService(
  travellerId: string,
  input: PlannerReview,
) {
  validateReview(input);
  const request = await prisma.request.findUnique({
    where: { id: input.requestId },
    include: {
      planner: true,
    },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.travellerId !== travellerId) {
    throw new Error("Forbidden");
  }

  if (!request.plannerId) {
    throw new Error("Planner not found");
  }

  if (request.status !== "completed") {
    throw new Error("Review can only be written after completion");
  }

  const existingReview = await prisma.plannerReview.findUnique({
    where: { requestId: input.requestId },
  });

  if (existingReview) {
    throw new Error("Review already exists");
  }

  const review = await prisma.plannerReview.create({
    data: {
      requestId: input.requestId,
      travellerId,
      plannerId: request.plannerId,
      overallRating: input.overallRating,
      planQuality: input.planQuality,
      communication: input.communication,
      timeliness: input.timeliness,
      personalisation: input.personalisation,
      practicality: input.practicality,
      detailLevel: input.detailLevel,
      content: input.content.trim(),
    },
    include: {
      traveller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  refreshPlannerReviewSummary(request.plannerId);

  return review;
}

export async function createPlanReviewService(
  userId: string,
  input: ReviewType,
  planId: string,
) {
  validatePlanReview(input);

  const existingPlan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!existingPlan) {
    throw new Error("Plan not found");
  }

  const purchased = await prisma.gotPlans.findFirst({
    where: { planId: planId, buyerId: userId },
  });

  if (!purchased) {
    throw new Error("Forbidden");
  }

  const existingReview = await prisma.planReview.findFirst({
    where: { userId, planId: planId },
  });

  if (existingReview) {
    throw new Error("Review already exists");
  }

  const review = await prisma.planReview.create({
    data: {
      userId,
      planId: planId,
      overallRating: input.overallRating,
      planQuality: input.planQuality,
      practicality: input.practicality,
      detailLevel: input.detailLevel,
      content: input.content.trim(),
      status: "submitted",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  refreshPlanReviewSummary(planId);

  return review;
}

export async function editReviewService(
  travellerId: string,
  input: PlannerReview,
) {
  validateReview(input);

  const plannerReview = await prisma.plannerReview.findUnique({
    where: { requestId: input.requestId },
  });

  if (!plannerReview) {
    throw new Error("Review not found");
  }

  if (plannerReview.travellerId !== travellerId) {
    throw new Error("Forbidden");
  }

  const review = await prisma.plannerReview.update({
    data: {
      overallRating: input.overallRating,
      planQuality: input.planQuality,
      communication: input.communication,
      timeliness: input.timeliness,
      personalisation: input.personalisation,
      practicality: input.practicality,
      detailLevel: input.detailLevel,
      content: input.content.trim(),
    },
    where: {
      id: plannerReview.id,
    },
  });

  refreshPlannerReviewSummary(plannerReview.plannerId);

  return review;
}

export async function getPlannerReviewForRequestService(requestId: string) {
  return prisma.plannerReview.findUnique({
    where: { requestId },
  });
}
