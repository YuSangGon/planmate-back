import { prisma } from "../lib/prisma";
import { getPlannerReviewSummaryService } from "./review.service";

export async function getPlanners() {
  const planners = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      bio: true,
      _count: {
        select: {
          plannerPlans: true,
        },
      },
      plannerReviewSummary: {
        select: {
          reviewCount: true,
          rating: true,
          planQuality: true,
          communication: true,
          timeliness: true,
          personalisation: true,
          practicality: true,
          detailLevel: true,
          strengths: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return planners.map((planner: any) => ({
    id: planner.id,
    name: planner.name,
    description:
      planner.bio || "Enjoys creating thoughtful and practical travel plans.",
    completedPlans: planner._count.plannerPlans,

    plannerReviewSummary: {
      reviewCount: planner.plannerReviewSummary?.reviewCount ?? 0,
      rating: planner.plannerReviewSummary?.rating ?? 0,
      planQuality: planner.plannerReviewSummary?.planQuality ?? 0,
      communication: planner.plannerReviewSummary?.communication ?? 0,
      timeliness: planner.plannerReviewSummary?.timeliness ?? 0,
      personalisation: planner.plannerReviewSummary?.personalisation ?? 0,
      practicality: planner.plannerReviewSummary?.practicality ?? 0,
      detailLevel: planner.plannerReviewSummary?.detailLevel ?? 0,
      strengths: planner.plannerReviewSummary?.strengths ?? "",
    },
  }));
}

export async function getPlannerById(plannerId: string) {
  const planner = await prisma.user.findFirst({
    where: {
      id: plannerId,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      _count: {
        select: {
          plannerPlans: true,
        },
      },
      plannerPlans: {
        where: {
          visibility: "public",
        },
        select: {
          id: true,
          title: true,
          destination: true,
          duration: true,
          price: true,
          summary: true,
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      plannerReceivedReviews: {
        select: {
          id: true,
          overallRating: true,
          planQuality: true,
          communication: true,
          timeliness: true,
          personalisation: true,
          practicality: true,
          detailLevel: true,
          content: true,
          createdAt: true,
          traveller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      plannerReviewSummary: {
        select: {
          id: true,
          reviewCount: true,
          rating: true,
          planQuality: true,
          communication: true,
          timeliness: true,
          personalisation: true,
          practicality: true,
          detailLevel: true,
          strengths: true,
        },
      },
    },
  });

  if (!planner) {
    return null;
  }

  return {
    id: planner.id,
    name: planner.name,
    description:
      planner.bio || "Enjoys creating thoughtful and practical travel plans.",
    completedPlans: planner._count.plannerPlans,
    strengths: planner.plannerReviewSummary?.strengths
      ? planner.plannerReviewSummary.strengths
      : "",
    plannerReviewSummary: {
      id: planner.plannerReviewSummary?.id ?? "",
      reviewCount: planner.plannerReviewSummary?.reviewCount ?? 0,
      rating: planner.plannerReviewSummary?.rating ?? 0,
      planQuality: planner.plannerReviewSummary?.planQuality ?? 0,
      communication: planner.plannerReviewSummary?.communication ?? 0,
      timeliness: planner.plannerReviewSummary?.timeliness ?? 0,
      personalisation: planner.plannerReviewSummary?.personalisation ?? 0,
      practicality: planner.plannerReviewSummary?.practicality ?? 0,
      detailLevel: planner.plannerReviewSummary?.detailLevel ?? 0,
      strengths: planner.plannerReviewSummary?.strengths ?? "",
    },
    plannerPlans: planner.plannerPlans.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      destination: plan.destination,
      duration: plan.duration,
      price: `GBP ${plan.price}`,
      summary: plan.summary,
      tags: plan.tags,
    })),
    plannerReviews: planner.plannerReceivedReviews.map((review: any) => ({
      id: review.id,
      overallRating: review.overallRating,
      planQuality: review.planQuality,
      communication: review.communication,
      timeliness: review.timeliness,
      personalisation: review.personalisation,
      practicality: review.practicality,
      detailLevel: review.detailLevel,
      content: review.content,
      createdAt: review.createdAt.toISOString(),
      traveller: review.traveller
        ? {
            id: review.traveller.id,
            name: review.traveller.name,
          }
        : undefined,
    })),
  };
}

export async function getPlannerDetailService(plannerId: string) {
  const planner = await prisma.user.findFirst({
    where: {
      id: plannerId,
    },
    include: {
      plannerReceivedReviews: {
        orderBy: { createdAt: "desc" },
        include: {
          traveller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      plannerPlans: {
        where: { visibility: "public" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!planner) {
    throw new Error("Planner not found");
  }

  const reviewSummary = await getPlannerReviewSummaryService(plannerId);

  return {
    ...planner,
    reviewSummary,
  };
}
