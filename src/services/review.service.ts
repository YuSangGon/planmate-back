import { prisma } from "../lib/prisma";

export async function getPlannerReviews(plannerId: string) {
  return prisma.plannerReview.findMany({
    where: { plannerId },
    include: {
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
  });
}

export async function getReceivedReviewsForPlanner(plannerId: string) {
  return prisma.plannerReview.findMany({
    where: { plannerId },
    include: {
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
  });
}
