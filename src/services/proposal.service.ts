import { prisma } from "../lib/prisma";

export async function getSentProposalsForPlanner(plannerId: string) {
  return prisma.matchProposal.findMany({
    where: { plannerId },
    include: {
      request: {
        select: {
          id: true,
          destination: true,
          duration: true,
          budget: true,
          offerCost: true,
          status: true,
          traveller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSentProposalDetail(
  proposalId: string,
  plannerId: string,
) {
  const proposal = await prisma.matchProposal.findUnique({
    where: { id: proposalId },
    include: {
      request: {
        include: {
          traveller: {
            select: {
              id: true,
              name: true,
              email: true,
              bio: true,
            },
          },
        },
      },
      planner: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
        },
      },
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.plannerId !== plannerId) {
    throw new Error("Forbidden");
  }

  return proposal;
}

export async function updateSentProposal(input: {
  proposalId: string;
  plannerId: string;
  message: string;
  proposedPrice?: number;
  estimatedDays?: number;
}) {
  const proposal = await prisma.matchProposal.findUnique({
    where: { id: input.proposalId },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  if (proposal.status !== "pending") {
    throw new Error("Only pending proposals can be edited");
  }

  return prisma.matchProposal.update({
    where: { id: input.proposalId },
    data: {
      message: input.message,
      proposedPrice: input.proposedPrice,
      estimatedDays: input.estimatedDays,
    },
  });
}

export async function deleteSentProposal(input: {
  proposalId: string;
  plannerId: string;
}) {
  const proposal = await prisma.matchProposal.findUnique({
    where: { id: input.proposalId },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  if (proposal.status !== "pending") {
    throw new Error("Only pending proposals can be deleted");
  }

  await prisma.matchProposal.delete({
    where: { id: input.proposalId },
  });

  return { id: input.proposalId };
}

export async function withdrawAcceptedProposal(input: {
  proposalId: string;
  plannerId: string;
}) {
  const proposal = await prisma.matchProposal.findUnique({
    where: { id: input.proposalId },
    include: {
      request: true,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  if (proposal.status !== "accepted") {
    throw new Error("Only accepted proposals can be withdrawn");
  }

  return prisma.$transaction(async (tx) => {
    const updatedProposal = await tx.matchProposal.update({
      where: { id: input.proposalId },
      data: { status: "withdrawn" },
    });

    await tx.request.update({
      where: { id: proposal.requestId },
      data: {
        plannerId: null,
        status: "open",
      },
    });

    return updatedProposal;
  });
}

export async function createProposal(input: {
  requestId: string;
  plannerId: string;
  message: string;
  proposedPrice?: number;
  estimatedDays?: number;
}) {
  const request = await prisma.request.findUnique({
    where: { id: input.requestId },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.status !== "open") {
    throw new Error("This request is no longer open");
  }

  if (request.travellerId === input.plannerId) {
    throw new Error("You cannot send a proposal to your own request");
  }

  const existingProposal = await prisma.matchProposal.findUnique({
    where: {
      requestId_plannerId: {
        requestId: input.requestId,
        plannerId: input.plannerId,
      },
    },
  });

  if (existingProposal) {
    throw new Error("You have already sent a proposal for this request");
  }

  return prisma.matchProposal.create({
    data: {
      requestId: input.requestId,
      plannerId: input.plannerId,
      message: input.message,
      proposedPrice: input.proposedPrice,
      estimatedDays: input.estimatedDays,
      status: "pending",
    },
  });
}

export async function getProposalsForTravellerRequest(input: {
  requestId: string;
  travellerId: string;
}) {
  const request = await prisma.request.findUnique({
    where: { id: input.requestId },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.travellerId !== input.travellerId) {
    throw new Error("Forbidden");
  }

  return prisma.matchProposal.findMany({
    where: { requestId: input.requestId },
    include: {
      planner: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function acceptProposal(input: {
  proposalId: string;
  travellerId: string;
}) {
  const proposal = await prisma.matchProposal.findUnique({
    where: { id: input.proposalId },
    include: {
      request: true,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.request.travellerId !== input.travellerId) {
    throw new Error("Forbidden");
  }

  if (proposal.request.status !== "open") {
    throw new Error("This request is no longer open");
  }

  return prisma.$transaction(async (tx) => {
    const acceptedProposal = await tx.matchProposal.update({
      where: { id: input.proposalId },
      data: { status: "accepted" },
      include: {
        planner: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            role: true,
          },
        },
      },
    });

    const rejectedProposals = await tx.matchProposal.findMany({
      where: {
        requestId: proposal.requestId,
        id: { not: input.proposalId },
        status: "pending",
      },
      select: {
        id: true,
      },
    });

    await tx.matchProposal.updateMany({
      where: {
        requestId: proposal.requestId,
        id: { not: input.proposalId },
        status: "pending",
      },
      data: { status: "rejected" },
    });

    const updatedRequest = await tx.request.update({
      where: { id: proposal.requestId },
      data: {
        plannerId: proposal.plannerId,
        status: "matched",
      },
      select: {
        id: true,
        plannerId: true,
        status: true,
      },
    });

    return {
      acceptedProposal,
      rejectedProposalIds: rejectedProposals.map((item) => item.id),
      request: updatedRequest,
    };
  });
}

export async function rejectProposal(input: {
  proposalId: string;
  travellerId: string;
}) {
  const proposal = await prisma.matchProposal.findUnique({
    where: { id: input.proposalId },
    include: {
      request: true,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.request.travellerId !== input.travellerId) {
    throw new Error("Forbidden");
  }

  if (proposal.status !== "pending") {
    throw new Error("Only pending proposals can be rejected");
  }

  return prisma.matchProposal.update({
    where: { id: input.proposalId },
    data: { status: "rejected" },
  });
}
