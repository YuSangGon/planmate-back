import { prisma } from "../lib/prisma";

type RequestStatus =
  | "open"
  | "matched"
  | "in_progress"
  | "submitted"
  | "completed"
  | "cancelled";

const WRITABLE_STATUSES: RequestStatus[] = [
  "matched",
  "in_progress",
  "submitted",
];

export async function getRequestChatContextOrThrow(
  requestId: string,
  userId: string,
) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      traveller: {
        select: { id: true, name: true, email: true, role: true },
      },
      planner: {
        select: { id: true, name: true, email: true, role: true },
      },
      chatRoom: true,
    },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  // const isParticipant =
  //   request.travellerId === userId || request.plannerId === userId;

  // if (!isParticipant || !request.plannerId) {
  //   throw new Error("Forbidden");
  // }

  const canSend = WRITABLE_STATUSES.includes(request.status);

  return {
    request,
    canSend,
  };
}

export async function ensureRequestChatRoom(requestId: string) {
  return prisma.chatRoom.upsert({
    where: { requestId },
    update: {},
    create: { requestId },
  });
}

export async function getRequestMessagesService(
  requestId: string,
  userId: string,
) {
  const { request, canSend } = await getRequestChatContextOrThrow(
    requestId,
    userId,
  );

  const room = await prisma.chatRoom.findUnique({
    where: { requestId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  return {
    roomId: room?.id ?? null,
    requestId: request.id,
    requestStatus: request.status,
    canSend,
    participants: {
      traveller: request.traveller,
      planner: request.planner,
    },
    messages:
      room?.messages.map((message: any) => ({
        id: message.id,
        content: message.content,
        isSystem: message.isSystem,
        createdAt: message.createdAt,
        sender: message.sender,
      })) ?? [],
  };
}

export async function createRequestMessageService(
  requestId: string,
  userId: string,
  content: string,
) {
  const { canSend } = await getRequestChatContextOrThrow(requestId, userId);

  if (!canSend) {
    throw new Error("This chat is read-only now");
  }

  if (!content.trim()) {
    throw new Error("Message content is required");
  }

  if (content.trim().length > 1000) {
    throw new Error("Message is too long");
  }

  const room = await ensureRequestChatRoom(requestId);

  const message = await prisma.chatMessages.create({
    data: {
      roomId: room.id,
      senderId: userId,
      content: content.trim(),
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return {
    id: message.id,
    content: message.content,
    isSystem: message.isSystem,
    createdAt: message.createdAt,
    sender: message.sender,
  };
}

export async function createRequestSystemMessage(
  requestId: string,
  content: string,
) {
  const room = await ensureRequestChatRoom(requestId);

  return prisma.chatMessages.create({
    data: {
      roomId: room.id,
      content,
      isSystem: true,
    },
  });
}

export async function getMyChatRoomsService(userId: string) {
  const rooms = await prisma.chatRoom.findMany({
    where: {
      request: {
        OR: [{ travellerId: userId }, { plannerId: userId }],
        plannerId: { not: null },
      },
    },
    include: {
      request: {
        include: {
          traveller: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          planner: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rooms.map((room: any) => {
    const isTraveller = room.request.travellerId === userId;
    const otherParticipant = isTraveller
      ? room.request.planner
      : room.request.traveller;

    return {
      roomId: room.id,
      requestId: room.requestId,
      requestStatus: room.request.status,
      destination: room.request.destination,
      updatedAt: room.updatedAt,
      canSend: WRITABLE_STATUSES.includes(room.request.status),
      otherParticipant,
      lastMessage: room.messages[0]
        ? {
            content: room.messages[0].content,
            createdAt: room.messages[0].createdAt,
            isSystem: room.messages[0].isSystem,
          }
        : null,
    };
  });
}
