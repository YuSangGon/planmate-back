import { prisma } from "../lib/prisma";

function formatStrengths(strengths: string | null | undefined) {
  if (!strengths) return [];
  return strengths
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function getDashboardOverviewService(userId: string) {
  const [
    activeRequestsCount,
    receivedProposalsCount,
    myPlansCount,
    completedPlansCount,
    plannerReviewSummary,
  ] = await Promise.all([
    prisma.request.count({
      where: {
        OR: [{ travellerId: userId }, { plannerId: userId }],
      },
    }),
    prisma.matchProposal.count({
      where: {
        request: {
          travellerId: userId,
        },
      },
    }),
    prisma.plan.count({
      where: {
        plannerId: userId,
      },
    }),
    prisma.plan.count({
      where: {
        plannerId: userId,
        status: "approved",
      },
    }),
    prisma.plannerReviewSummary.findUnique({
      where: {
        userId,
      },
    }),
  ]);

  return {
    stats: {
      activeRequestsCount,
      receivedProposalsCount,
      myPlansCount,
      completedPlansCount,
    },
    plannerReviewSummary: plannerReviewSummary
      ? {
          reviewCount: plannerReviewSummary.reviewCount,
          rating: plannerReviewSummary.rating,
          planQuality: plannerReviewSummary.planQuality,
          communication: plannerReviewSummary.communication,
          timeliness: plannerReviewSummary.timeliness,
          personalisation: plannerReviewSummary.personalisation,
          practicality: plannerReviewSummary.practicality,
          detailLevel: plannerReviewSummary.detailLevel,
          strengths: plannerReviewSummary.strengths,
          strengthsList: formatStrengths(plannerReviewSummary.strengths),
        }
      : null,
  };
}

export async function getDashboardRequestsService(userId: string) {
  const items = await prisma.request.findMany({
    where: {
      OR: [{ travellerId: userId }, { plannerId: userId }],
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      destination: true,
      status: true,
      duration: true,
      budget: true,
      createdAt: true,
      travellerId: true,
      plannerId: true,
      traveller: {
        select: {
          id: true,
          name: true,
        },
      },
      planner: {
        select: {
          id: true,
          name: true,
        },
      },
      plans: {
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          status: true,
          title: true,
        },
      },
    },
  });

  return items.map((item: any) => {
    const isTravellerSide = item.travellerId === userId;
    const latestPlan = item.plans[0] ?? null;

    return {
      id: item.id,
      destination: item.destination,
      status: item.status,
      duration: item.duration,
      budget: item.budget,
      createdAt: item.createdAt.toISOString(),
      perspective: isTravellerSide ? "traveller" : "planner",
      traveller: item.traveller,
      planner: item.planner,
      nextAction:
        item.status === "matched" && !latestPlan
          ? isTravellerSide
            ? "Wait for planner to start"
            : "Start building a plan"
          : item.status === "in_progress"
            ? isTravellerSide
              ? "Waiting for submitted plan"
              : "Continue plan drafting"
            : item.status === "submitted"
              ? isTravellerSide
                ? "Review submitted plan"
                : "Waiting for traveller approval"
              : "Open detail",
      latestPlan: latestPlan
        ? {
            id: latestPlan.id,
            status: latestPlan.status,
            title: latestPlan.title,
          }
        : null,
    };
  });
}

export async function getDashboardProposalsService(userId: string) {
  const items = await prisma.matchProposal.findMany({
    where: {
      OR: [
        {
          request: {
            travellerId: userId,
          },
        },
        {
          request: {
            plannerId: userId,
          },
        },
      ],
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      requestId: true,
      message: true,
      proposedPrice: true,
      estimatedDays: true,
      status: true,
      createdAt: true,
      request: {
        select: {
          destination: true,
          duration: true,
          budget: true,
          status: true,
          traveller: {
            select: {
              id: true,
            },
          },
        },
      },
      planner: {
        select: {
          id: true,
          name: true,
          bio: true,
          plannerReviewSummary: {
            select: {
              rating: true,
              reviewCount: true,
              strengths: true,
            },
          },
        },
      },
    },
  });

  return items.map((item: any) => ({
    id: item.id,
    requestId: item.requestId,
    destination: item.request.destination,
    duration: item.request.duration,
    budget: item.request.budget,
    requestStatus: item.request.status,
    planner: {
      id: item.planner.id,
      name: item.planner.name,
      bio: item.planner.bio,
      rating: item.planner.plannerReviewSummary?.rating ?? 0,
      reviewCount: item.planner.plannerReviewSummary?.reviewCount ?? 0,
      strengths: formatStrengths(item.planner.plannerReviewSummary?.strengths),
    },
    message: item.message,
    proposedPrice: item.proposedPrice,
    estimatedDays: item.estimatedDays,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
  }));
}

export async function getDashboardPlansService(userId: string) {
  const items = await prisma.plan.findMany({
    where: {
      plannerId: userId,
      planType: "personal",
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      destination: true,
      duration: true,
      price: true,
      visibility: true,
      status: true,
      summary: true,
      tags: true,
      createdAt: true,
      planType: true,
      request: {
        select: {
          id: true,
          destination: true,
        },
      },
      planReviewSummary: {
        select: {
          reviewCount: true,
          rating: true,
          planQuality: true,
          practicality: true,
          detailLevel: true,
        },
      },
      planReviews: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          overallRating: true,
          planQuality: true,
          practicality: true,
          detailLevel: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return items.map((plan: any) => ({
    id: plan.id,
    title: plan.title,
    destination: plan.destination,
    duration: plan.duration,
    price: `GBP ${plan.price}`,
    visibility: plan.visibility,
    status: plan.status,
    summary: plan.summary,
    tags: plan.tags,
    createdAt: plan.createdAt.toISOString(),
    request: plan.request
      ? {
          id: plan.request.id,
          destination: plan.request.destination,
        }
      : null,
    reviewSummary: {
      reviewCount: plan.planReviewSummary?.reviewCount ?? 0,
      rating: plan.planReviewSummary?.rating ?? 0,
      planQuality: plan.planReviewSummary?.planQuality ?? 0,
      practicality: plan.planReviewSummary?.practicality ?? 0,
      detailLevel: plan.planReviewSummary?.detailLevel ?? 0,
    },
    reviews: plan.planReviews.map((review: any) => ({
      id: review.id,
      overallRating: review.overallRating,
      planQuality: review.planQuality,
      practicality: review.practicality,
      detailLevel: review.detailLevel,
      content: review.content,
      createdAt: review.createdAt.toISOString(),
      user: review.user,
    })),
  }));
}
