import { prisma } from "../lib/prisma";

type CreateRequestInput = {
  travellerId: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  duration: string;
  budget: string;
  offerCost: number;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;
};

export async function getMyRequestList(travellerId: string) {
  return prisma.request.findMany({
    where: { travellerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRequestList() {
  return prisma.request.findMany({
    where: { status: "open" },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRequestDetailById(input: {
  requestId: string;
  plannerId?: string;
}) {
  const requestItem = await prisma.request.findFirst({
    where: {
      id: input.requestId,
    },
    include: {
      traveller: {
        select: {
          id: true,
          name: true,
          bio: true,
        },
      },
      _count: {
        select: {
          proposals: true,
        },
      },
      proposals: input.plannerId
        ? {
            where: {
              plannerId: input.plannerId,
            },
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          }
        : false,
    },
  });

  if (!requestItem) {
    return null;
  }

  const { proposals, ...rest } = requestItem;

  return {
    ...rest,
    myProposal: proposals?.[0] ?? null,
  };
}

export async function createTripRequest(input: CreateRequestInput) {
  const traveller = await prisma.user.findUnique({
    where: { id: input.travellerId },
    select: {
      id: true,
      coinBalance: true,
    },
  });

  if (!traveller) {
    throw new Error("Traveller not found");
  }

  if (traveller.coinBalance < input.offerCost) {
    throw new Error("Not enough coins to create this request");
  }

  return prisma.$transaction(async (tx: any) => {
    await tx.user.update({
      where: { id: input.travellerId },
      data: {
        coinBalance: {
          decrement: input.offerCost,
        },
      },
    });

    return tx.request.create({
      data: {
        travellerId: input.travellerId,
        destination: input.destination,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        duration: input.duration,
        budget: input.budget,
        offerCost: input.offerCost,
        travelStyle: input.travelStyle,
        interests: input.interests,
        extraNotes: input.extraNotes ?? "",
        status: "open",
        coinTransferred: false,
      },
    });
  });
}

export async function completeRequest(input: {
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
    throw new Error("This request does not have a matched planner yet");
  }

  if (requestItem.coinTransferred) {
    throw new Error("Coins were already transferred for this request");
  }

  if (!["matched", "in_progress", "submitted"].includes(requestItem.status)) {
    throw new Error("This request cannot be completed yet");
  }

  return prisma.$transaction(async (tx: any) => {
    await tx.user.update({
      where: { id: requestItem.plannerId! },
      data: {
        coinBalance: {
          increment: requestItem.offerCost,
        },
      },
    });

    return tx.request.update({
      where: { id: input.requestId },
      data: {
        status: "completed",
        coinTransferred: true,
      },
    });
  });
}
