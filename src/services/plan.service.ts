import { includes } from "zod";
import { prisma } from "../lib/prisma";

type CreatePlanInput = {
  plannerId: string;
  requestId?: string;
  travellerId?: string;
  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;
  visibility: "public" | "private";
  tags: string[];
};

type UpdatePlanInput = {
  planId: string;
  plannerId: string;
  title?: string;
  destination?: string;
  summary?: string;
  price?: number;
  duration?: string;
  visibility?: "public" | "private";
  tags?: string[];
};

export async function getPublicPlans() {
  return prisma.plan.findMany({
    where: { visibility: "public" },
    orderBy: { createdAt: "desc" },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
        },
      },
      planReviewSummary: {
        select: {
          reviewCount: true,
          rating: true,
        },
      },
    },
  });
}

export async function getPublicPlansTop3() {
  return prisma.plan.findMany({
    where: {
      visibility: "public",
    },
    take: 3,
    orderBy: [
      {
        planReviewSummary: {
          rating: "desc",
        },
      },
      {
        planReviewSummary: {
          reviewCount: "desc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      planner: {
        select: {
          id: true,
          name: true,
        },
      },
      planReviewSummary: {
        select: {
          reviewCount: true,
          rating: true,
        },
      },
    },
  });
}

export async function getPlansForPlanner(plannerId: string) {
  return prisma.plan.findMany({
    where: { plannerId, requestId: null },
    orderBy: { createdAt: "desc" },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getPlanById(planId: string) {
  return prisma.plan.findUnique({
    where: { id: planId },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
          bio: true,
          specialty: true,
        },
      },
      request: {
        select: {
          id: true,
          destination: true,
          status: true,
        },
      },
    },
  });
}

export async function getPlanByIdWithReview(planId: string) {
  return prisma.plan.findUnique({
    where: { id: planId },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
          bio: true,
        },
      },
      request: {
        select: {
          id: true,
          destination: true,
          status: true,
        },
      },
    },
  });
}

export async function getPublicPlanByIdWithReview(
  planId: string,
  userId: string,
) {
  const isGotPlan = userId
    ? await prisma.gotPlans.findFirst({
        where: {
          planId,
          buyerId: userId,
        },
      })
    : null;

  const myReview = userId
    ? await prisma.planReview.findFirst({
        where: {
          planId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    : null;

  const planData = await prisma.plan.findUnique({
    where: { id: planId },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
          bio: true,
        },
      },
      planReviewSummary: true,
      planReviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return {
    isGotPlan: !isGotPlan ? false : true,
    data: planData,
    myReview: myReview,
  };
}

export async function createPlan(input: CreatePlanInput) {
  return prisma.plan.create({
    data: {
      requestId: input.requestId ?? null,
      plannerId: input.plannerId,
      travellerId: input.travellerId ?? null,
      title: input.title,
      destination: input.destination,
      summary: input.summary,
      price: input.price,
      duration: input.duration,
      visibility: input.visibility,
      tags: input.tags,
    },
  });
}

export async function purchasePlanService(
  planId: string,
  userId: string,
  salePrice: number,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("Forbidden");
  }

  const plan = await prisma.plan.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  if (plan.salePrice !== salePrice) {
    throw new Error("The price has been changed.");
  }

  if (user.coinBalance < salePrice) {
    throw new Error("Coin balance is not enough to purchase");
  }

  const buyHistory = await prisma.gotPlans.findFirst({
    where: {
      buyerId: userId,
      planId: planId,
    },
  });

  if (!!buyHistory) {
    throw new Error("Already purchased.");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      coinBalance: user.coinBalance - salePrice,
    },
  });

  return prisma.gotPlans.create({
    data: {
      buyerId: userId,
      planId: planId,
    },
  });
}

export async function updatePlan(input: UpdatePlanInput) {
  const existingPlan = await prisma.plan.findUnique({
    where: { id: input.planId },
  });

  if (!existingPlan) {
    throw new Error("Plan not found");
  }

  if (existingPlan.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  return prisma.plan.update({
    where: { id: input.planId },
    data: {
      title: input.title,
      destination: input.destination,
      summary: input.summary,
      price: input.price,
      duration: input.duration,
      visibility: input.visibility,
      tags: input.tags,
    },
  });
}

export async function deletePlan(planId: string, plannerId: string) {
  const existingPlan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!existingPlan) {
    throw new Error("Plan not found");
  }

  if (existingPlan.plannerId !== plannerId) {
    throw new Error("Forbidden");
  }

  await prisma.plan.delete({
    where: { id: planId },
  });

  return { id: planId };
}
