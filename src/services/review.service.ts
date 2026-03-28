import { prisma } from "../lib/prisma";
import type { PlannerReview, PlannerReviewSummary } from "../types/review";
import { refreshPlannerReviewSummary } from "./plannerReviewSummary.service";

function validateRating(value: number, fieldName: string) {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`${fieldName} must be an integer between 1 and 5`);
  }
}

function validateReview(input: PlannerReview) {
  // validateRating(input.overallRating, "overallRating");
  validateRating(input.planQuality, "planQuality");
  validateRating(input.communication, "communication");
  validateRating(input.timeliness, "timeliness");
  validateRating(input.personalisation, "personalisation");
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

export async function getPlannerReviewSummaryService(
  plannerId: string,
): Promise<PlannerReviewSummary> {
  const aggregate = await prisma.review.aggregate({
    where: { plannerId },
    _count: { id: true },
    _avg: {
      overallRating: true,
      planQuality: true,
      communication: true,
      timeliness: true,
      personalisation: true,
      practicality: true,
      detailLevel: true,
    },
  });

  return {
    reviewCount: aggregate._count.id,
    overallRatingAvg: Number(aggregate._avg.overallRating ?? 0),
    planQualityAvg: Number(aggregate._avg.planQuality ?? 0),
    communicationAvg: Number(aggregate._avg.communication ?? 0),
    timelinessAvg: Number(aggregate._avg.timeliness ?? 0),
    personalisationAvg: Number(aggregate._avg.personalisation ?? 0),
    practicalityAvg: Number(aggregate._avg.practicality ?? 0),
    detailLevelAvg: Number(aggregate._avg.detailLevel ?? 0),
  };
}

export async function getPlannerReviewsService(plannerId: string) {
  return prisma.review.findMany({
    where: { plannerId },
    orderBy: { createdAt: "desc" },
    include: {
      traveller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getTravellerWrittenReviewsService(travellerId: string) {
  return prisma.review.findMany({
    where: { travellerId },
    orderBy: { createdAt: "desc" },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
        },
      },
      request: {
        select: {
          id: true,
          destination: true,
        },
      },
    },
  });
}
