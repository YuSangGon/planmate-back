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
  // TODO : 리뷰도 가져오기
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
