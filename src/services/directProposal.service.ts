import { prisma } from "../lib/prisma";

type CreateDirectProposalInput = {
  plannerId: string;
  travellerId: string;
  title: string;
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;
};

export async function createDirectProposal(input: CreateDirectProposalInput) {
  const planner = await prisma.user.findFirst({
    where: {
      id: input.plannerId,
      role: "planner",
    },
  });

  if (!planner) {
    throw new Error("Planner not found");
  }

  if (input.plannerId === input.travellerId) {
    throw new Error("You cannot send a direct proposal to yourself");
  }

  return prisma.directProposal.create({
    data: {
      plannerId: input.plannerId,
      travellerId: input.travellerId,
      title: input.title,
      destination: input.destination,
      duration: input.duration,
      budget: input.budget,
      travelStyle: input.travelStyle,
      interests: input.interests,
      extraNotes: input.extraNotes ?? "",
      status: "pending",
    },
  });
}

export async function getReceivedDirectProposalsForPlanner(plannerId: string) {
  return prisma.directProposal.findMany({
    where: { plannerId },
    include: {
      traveller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getReceivedDirectProposalDetail(
  proposalId: string,
  plannerId: string,
) {
  const proposal = await prisma.directProposal.findUnique({
    where: { id: proposalId },
    include: {
      traveller: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
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

export async function acceptReceivedDirectProposal(input: {
  proposalId: string;
  plannerId: string;
}) {
  const proposal = await prisma.directProposal.findUnique({
    where: { id: input.proposalId },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  if (proposal.status !== "pending") {
    throw new Error("Only pending proposals can be accepted");
  }

  return prisma.directProposal.update({
    where: { id: input.proposalId },
    data: { status: "accepted" },
  });
}

export async function rejectReceivedDirectProposal(input: {
  proposalId: string;
  plannerId: string;
}) {
  const proposal = await prisma.directProposal.findUnique({
    where: { id: input.proposalId },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.plannerId !== input.plannerId) {
    throw new Error("Forbidden");
  }

  if (proposal.status !== "pending") {
    throw new Error("Only pending proposals can be rejected");
  }

  return prisma.directProposal.update({
    where: { id: input.proposalId },
    data: { status: "rejected" },
  });
}
