import { prisma } from "../lib/prisma";

export async function getPlanners() {
  const planners = await prisma.user.findMany({
    where: { role: "planner" },
    select: {
      id: true,
      name: true,
      bio: true,
      specialty: true,
      rating: true,
      reviewCount: true,
      _count: {
        select: {
          plannerPlans: true,
        },
      },
    },
    orderBy: [
      { rating: "desc" },
      { reviewCount: "desc" },
      { createdAt: "desc" },
    ],
  });

  return planners.map((planner) => ({
    id: planner.id,
    name: planner.name,
    specialty: planner.specialty || "Travel planning",
    description:
      planner.bio || "Enjoys creating thoughtful and practical travel plans.",
    rating: planner.rating ? planner.rating.toFixed(1) : "New",
    reviews:
      planner.reviewCount > 0
        ? `${planner.reviewCount} reviews`
        : "No reviews yet",
    completedPlans: planner._count.plannerPlans,
  }));
}

export async function getPlannerById(plannerId: string) {
  const planner = await prisma.user.findFirst({
    where: {
      id: plannerId,
      role: "planner",
    },
    select: {
      id: true,
      name: true,
      bio: true,
      specialty: true,
      rating: true,
      reviewCount: true,
      location: true,
      responseRate: true,
      strengths: true,
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
      reviewsReceived: {
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
      },
    },
  });

  if (!planner) {
    return null;
  }

  return {
    id: planner.id,
    name: planner.name,
    specialty: planner.specialty || "Travel planning",
    description:
      planner.bio || "Enjoys creating thoughtful and practical travel plans.",
    rating: planner.rating ? planner.rating.toFixed(1) : "New",
    reviews:
      planner.reviewCount > 0
        ? `${planner.reviewCount} reviews`
        : "No reviews yet",
    completedPlans: planner._count.plannerPlans,
    responseRate: planner.responseRate || "—",
    location: planner.location || "Not specified",
    intro:
      planner.bio || "This planner has not added a detailed introduction yet.",
    strengths: planner.strengths ?? [],
    plannerPlans: planner.plannerPlans.map((plan) => ({
      id: plan.id,
      title: plan.title,
      destination: plan.destination,
      duration: plan.duration,
      price: `GBP ${plan.price}`,
      summary: plan.summary,
      tags: plan.tags,
    })),
    plannerReviews: planner.reviewsReceived.map((review) => ({
      id: review.id,
      author: review.traveller.name,
      rating: review.rating,
      content: review.content,
      createdAt: review.createdAt.toISOString(),
    })),
  };
}
