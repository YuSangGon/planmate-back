import { prisma } from "../lib/prisma";
import { getPlannerReviewSummaryService } from "./review.service";

export async function getPlanners() {
  // TODO : 리뷰 서머리에서 대략적인 리뷰 가져요기
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
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return planners.map((planner: any) => ({
    id: planner.id,
    name: planner.name,
    description:
      planner.bio || "Enjoys creating thoughtful and practical travel plans.",
    completedPlans: planner._count.plannerPlans,
  }));
}

export async function getPlannerById(plannerId: string) {
  // TODO : 리뷰 가져오는 부분 추가
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
      // plannerReceivedReviews: {
      //   include: {
      //     traveller: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //   },
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      // },
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
    intro:
      planner.bio || "This planner has not added a detailed introduction yet.",
    plannerPlans: planner.plannerPlans.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      destination: plan.destination,
      duration: plan.duration,
      price: `GBP ${plan.price}`,
      summary: plan.summary,
      tags: plan.tags,
    })),
    // plannerReviews: planner.plannerReceivedReviews.map((review: any) => ({
    //   id: review.id,
    //   author: review.traveller.name,
    //   rating: review.rating,
    //   content: review.content,
    //   createdAt: review.createdAt.toISOString(),
    // })),
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
