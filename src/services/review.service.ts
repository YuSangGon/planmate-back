import { prisma } from "../lib/prisma";
import type { CreateReviewInput, PlannerReviewSummary } from "../types/review";

function validateRating(value: number, fieldName: string) {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`${fieldName} must be an integer between 1 and 5`);
  }
}

export async function createReviewService(
  travellerId: string,
  input: CreateReviewInput,
) {
  validateRating(input.overallRating, "overallRating");
  validateRating(input.planQuality, "planQuality");
  validateRating(input.communication, "communication");
  validateRating(input.timeliness, "timeliness");
  validateRating(input.personalisation, "personalisation");
  validateRating(input.practicality, "practicality");
  validateRating(input.detailLevel, "detailLevel");

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

  const existingReview = await prisma.review.findUnique({
    where: { requestId: input.requestId },
  });

  if (existingReview) {
    throw new Error("Review already exists");
  }

  const review = await prisma.review.create({
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

  return review;
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
