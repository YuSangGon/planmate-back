import { prisma } from "../lib/prisma";
import { buildFixedWorkPlanPreview } from "./workPlanPreview.util";

type WorkPlanContent = {
  days: Array<{
    title: string;
    items: Array<{
      time?: string;
      title: string;
      note?: string;
    }>;
  }>;
};

type UpdateWorkPlanInput = {
  requestId: string;
  plannerId: string;
  title: string;
  summary: string;
  duration: string;
  tags: string[];
  content: WorkPlanContent;
};

export async function getOrCreateWorkPlan(input: {
  requestId: string;
  plannerId: string;
}) {
  const requestItem = await prisma.request.findUnique({
    where: { id: input.requestId },
  });

  if (!requestItem) {
    throw new Error("Request not found");
  }

  if (requestItem.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  if (!["matched", "in_progress", "submitted"].includes(requestItem.status)) {
    throw new Error("This request is not ready for plan building");
  }

  const existingPlan = await prisma.plan.findFirst({
    where: {
      requestId: input.requestId,
      plannerId: input.plannerId,
    },
  });

  if (existingPlan) {
    return existingPlan;
  }

  const createdPlan = await prisma.plan.create({
    data: {
      requestId: requestItem.id,
      plannerId: input.plannerId,
      travellerId: requestItem.travellerId,
      title: `${requestItem.destination} plan`,
      destination: requestItem.destination,
      summary: "",
      price: requestItem.offerCost,
      duration: requestItem.duration,
      visibility: "private",
      status: "draft",
      tags: [],
      content: {
        days: [
          {
            title: "Day 1",
            items: [
              {
                time: "",
                title: "Add your first activity",
                note: "",
              },
            ],
          },
        ],
      },
    },
  });

  await prisma.request.update({
    where: { id: input.requestId },
    data: {
      status: "in_progress",
    },
  });

  return createdPlan;
}

export async function updateWorkPlan(input: UpdateWorkPlanInput) {
  const requestItem = await prisma.request.findUnique({
    where: { id: input.requestId },
  });

  if (!requestItem) {
    throw new Error("Request not found");
  }

  if (requestItem.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      requestId: input.requestId,
      plannerId: input.plannerId,
    },
  });

  if (!plan) {
    throw new Error("Work plan not found");
  }

  if (plan.status !== "draft") {
    throw new Error("Only draft plans can be edited");
  }

  return prisma.plan.update({
    where: { id: plan.id },
    data: {
      title: input.title,
      summary: input.summary,
      duration: input.duration,
      tags: input.tags,
      content: input.content,
    },
  });
}

export async function submitWorkPlan(input: {
  requestId: string;
  plannerId: string;
}) {
  const requestItem = await prisma.request.findUnique({
    where: { id: input.requestId },
  });

  if (!requestItem) {
    throw new Error("Request not found");
  }

  if (requestItem.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      requestId: input.requestId,
      plannerId: input.plannerId,
    },
  });

  if (!plan) {
    throw new Error("Work plan not found");
  }

  // if (plan.status !== "draft") {
  //   throw new Error("Only draft plans can be submitted");
  // }

  const previewContent = buildFixedWorkPlanPreview(plan.content as any, 3);

  return prisma.$transaction(async (tx: any) => {
    const updatedPlan = await tx.plan.update({
      where: { id: plan.id },
      data: {
        status: "submitted",
        previewContent,
      },
    });

    await tx.request.update({
      where: { id: input.requestId },
      data: {
        status: "submitted",
      },
    });

    return updatedPlan;
  });
}

export async function getTravellerPreviewPlan(input: {
  requestId: string;
  travellerId: string;
}) {
  const requestItem = await prisma.request.findUnique({
    where: { id: input.requestId },
  });

  if (!requestItem) {
    throw new Error("Request not found");
  }

  if (requestItem.travellerId !== input.travellerId) {
    throw new Error("Forbidden");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      requestId: input.requestId,
      travellerId: input.travellerId,
      status: {
        in: ["submitted", "approved"],
      },
    },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
          bio: true,
          specialty: true,
        },
      },
    },
  });

  if (!plan) {
    throw new Error("Submitted plan not found");
  }

  return {
    id: plan.id,
    requestId: plan.requestId,
    title: plan.title,
    summary: plan.summary,
    duration: plan.duration,
    destination: plan.destination,
    status: plan.status,
    planner: plan.planner,
    previewContent: plan.previewContent,
  };
}

export async function approveSubmittedPlan(input: {
  requestId: string;
  travellerId: string;
}) {
  const requestItem = await prisma.request.findUnique({
    where: { id: input.requestId },
  });

  if (!requestItem) {
    throw new Error("Request not found");
  }

  if (requestItem.travellerId !== input.travellerId) {
    throw new Error("Forbidden");
  }

  if (!requestItem.plannerId) {
    throw new Error("No matched planner for this request");
  }

  if (requestItem.coinTransferred) {
    throw new Error("Coins were already transferred for this request");
  }

  if ((requestItem.status as string) !== "submitted") {
    throw new Error("This request is not waiting for approval");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      requestId: input.requestId,
      travellerId: input.travellerId,
      status: "submitted",
    },
  });

  if (!plan) {
    throw new Error("Submitted plan not found");
  }

  return prisma.$transaction(async (tx: any) => {
    const updatedPlan = await tx.plan.update({
      where: { id: plan.id },
      data: {
        status: "approved",
      },
    });

    await tx.user.update({
      where: { id: requestItem.plannerId! },
      data: {
        coinBalance: {
          increment: requestItem.offerCost,
        },
      },
    });

    await tx.request.update({
      where: { id: input.requestId },
      data: {
        status: "completed",
        coinTransferred: true,
      },
    });

    return updatedPlan;
  });
}

// export async function getTravellerPreviewPlanService(
//   requestId: string,
//   travellerId: string,
// ) {
//   const workPlan = await prisma.workPlan.findUnique({
//     where: { requestId },
//     include: {
//       request: true,
//       planner: {
//         select: {
//           id: true,
//           name: true,
//           bio: true,
//         },
//       },
//     },
//   });

//   if (!workPlan) {
//     throw new Error("Preview plan not found");
//   }

//   if (workPlan.request.travellerId !== travellerId) {
//     throw new Error("Forbidden");
//   }

//   return {
//     id: workPlan.id,
//     requestId: workPlan.requestId,
//     title: workPlan.title,
//     summary: workPlan.summary,
//     duration: workPlan.duration,
//     destination: workPlan.destination,
//     status: workPlan.status,
//     planner: workPlan.planner,
//     previewContent: workPlan.previewContent,
//   };
// }
