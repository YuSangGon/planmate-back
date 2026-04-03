import { prisma } from "../lib/prisma";
import { buildFixedWorkPlanPreview } from "./workPlanPreview.util";

type WorkPlanHotelOption = {
  name: string;
  location: string;
  priceRange: string;
  bookingLink?: string;
  summary: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
};

type WorkPlanPreparation = {
  visaInfo: string;
  documents: string;
  transportToAirport: string;
  simWifi: string;
  moneyTips: string;
  packingTips: string;
  otherTips: string;
};

type WorkPlanScheduleItem = {
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  description: string;
  fee: string;
  estimatedCost: string;
  transport: string;
  durationNote: string;
  tips: string;
};

type WorkPlanDay = {
  title: string;
  dateLabel: string;
  summary: string;
  items: WorkPlanScheduleItem[];
};

type WorkPlanExtras = {
  localTransport: string;
  reservations: string;
  emergencyInfo: string;
  finalNotes: string;
};

type WorkPlanContent = {
  preparation: WorkPlanPreparation;
  hotels: WorkPlanHotelOption[];
  days: WorkPlanDay[];
  extras: WorkPlanExtras;
};

type UpdateWorkPlanInput = {
  requestId: string;
  plannerId: string;
  content: WorkPlanContent;
};

type EditWorkPlanInput = {
  planId: string;
  plannerId: string;
  planInfo: PlanInfo;
  content: WorkPlanContent;
};

type PlanSection = "preparation" | "hotels" | "days" | "extras";

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeysDeep(obj[key]);
        return acc;
      }, {});
  }

  return value;
}

function isEqualJson(a: unknown, b: unknown) {
  return JSON.stringify(sortKeysDeep(a)) === JSON.stringify(sortKeysDeep(b));
}

function getChangedSections(
  before: WorkPlanContent,
  after: WorkPlanContent,
): PlanSection[] {
  const previous = before ?? {
    overview: {},
    preparation: {},
    hotels: [],
    days: [],
    extras: {},
  };

  const changed: PlanSection[] = [];
  if (!isEqualJson(previous.preparation ?? {}, after.preparation ?? {})) {
    changed.push("preparation");
  }
  if (!isEqualJson(previous.hotels ?? [], after.hotels ?? [])) {
    changed.push("hotels");
  }
  if (!isEqualJson(previous.days ?? [], after.days ?? [])) {
    changed.push("days");
  }
  if (!isEqualJson(previous.extras ?? {}, after.extras ?? {})) {
    changed.push("extras");
  }

  return changed;
}

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
      visibility: "private",
      status: "draft",
      planType: "request",
      content: {
        preparation: {
          visaInfo: "",
        },
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

export type PlanInfo = {
  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;
  visibility: "public" | "private";
  tags: string[];
};

export async function createWorkPlan(input: {
  plannerId: string;
  data: PlanInfo;
}) {
  const planner = await prisma.user.findFirst({
    where: {
      id: input.plannerId,
    },
  });

  if (!planner) {
    throw new Error("Forbidden");
  }

  const createdPlan = await prisma.plan.create({
    data: {
      plannerId: input.plannerId,
      title: input.data.title,
      destination: input.data.destination,
      summary: input.data.summary,
      price: Number(input.data.price),
      duration: input.data.duration,
      visibility: input.data.visibility,
      tags: input.data.tags,
      status: "draft",
      planType: "personal",
      content: {
        preparation: {
          visaInfo: "",
        },
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

  return createdPlan;
}

export async function getWorkPlanInfo(planId: string) {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    select: {
      id: true,
      title: true,
      destination: true,
      summary: true,
      price: true,
      duration: true,
      visibility: true,
      tags: true,
    },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  return plan;
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

  if (plan.status === "approved") {
    throw new Error("Approved plans can't be edited");
  }

  return prisma.plan.update({
    where: { id: plan.id },
    data: {
      content: input.content,
    },
  });
}

export async function editWorkPlanService(input: EditWorkPlanInput) {
  const planItem = await prisma.plan.findUnique({
    where: { id: input.planId },
  });

  if (!planItem) {
    throw new Error("Plan not found");
  }

  if (planItem.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  return prisma.plan.update({
    where: { id: planItem.id },
    data: {
      title: input.planInfo.title,
      destination: input.planInfo.destination,
      summary: input.planInfo.summary,
      price: Number(input.planInfo.price),
      duration: input.planInfo.duration,
      visibility: input.planInfo.visibility,
      tags: input.planInfo.tags,
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

  const previewContent = buildFixedWorkPlanPreview(plan.content as any);

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

export async function completeWorkPlanService(input: {
  planId: string;
  plannerId: string;
}) {
  const planItem = await prisma.plan.findUnique({
    where: { id: input.planId },
  });

  if (!planItem) {
    throw new Error("Plan not found");
  }

  if (planItem.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  const previewContent = buildFixedWorkPlanPreview(planItem.content as any);

  const updatedPlan = await prisma.plan.update({
    where: { id: planItem.id },
    data: {
      status: "completed",
      previewContent,
    },
  });
  return updatedPlan;
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
    status: plan.status,
    planner: plan.planner,
    previewContent: plan.previewContent,
  };
}

export async function getPreviewPlan(planId: string) {
  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      status: {
        in: ["completed"],
      },
    },
  });

  if (!plan) {
    throw new Error("Completed plan not found");
  }

  return {
    id: plan.id,
    previewContent: plan.previewContent,
  };
}

export async function getPreviewRequestPlan(requestId: string, userId: string) {
  const plan = await prisma.plan.findFirst({
    where: {
      requestId: requestId,
      travellerId: userId,
      status: "submitted",
    },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  return {
    id: plan.id,
    previewContent: plan.previewContent,
  };
}

export async function getPlan(planId: string, userId: string) {
  const history = await prisma.gotPlans.findFirst({
    where: {
      buyerId: userId,
      planId: planId,
    },
  });

  if (!history) {
    throw new Error("Forbidden");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      status: {
        in: ["completed"],
      },
    },
  });

  if (!plan) {
    throw new Error("Completed plan not found");
  }

  return {
    id: plan.id,
    content: plan.content,
  };
}

export async function getRequestPlan(requestId: string, userId: string) {
  const plan = await prisma.plan.findFirst({
    where: {
      requestId: requestId,
      travellerId: userId,
      status: "completed",
    },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  return {
    id: plan.id,
    content: plan.content,
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
