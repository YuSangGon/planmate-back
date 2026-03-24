import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { socketAuth } from "../middlewares/socketAuth";
import {
  createRequestMessageService,
  getRequestChatContextOrThrow,
} from "../services/requestChatService";

type AuthedSocket = Parameters<typeof socketAuth>[0];

let io: Server | null = null;

function getRequestRoomName(requestId: string) {
  return `request:${requestId}`;
}

function getUserRoomName(userId: string) {
  return `user:${userId}`;
}

export function initSocketServer(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket: AuthedSocket) => {
    if (!socket.user) {
      return;
    }
    socket.join(getUserRoomName(socket.user.sub));

    socket.on("chat:join", async (payload: { requestId: string }) => {
      try {
        if (!socket.user) return;

        const { requestId } = payload;
        await getRequestChatContextOrThrow(requestId, socket.user.sub);

        socket.join(getRequestRoomName(requestId));
      } catch {
        socket.emit("chat:error", { message: "Failed to join chat room" });
      }
    });

    socket.on("chat:leave", (payload: { requestId: string }) => {
      const { requestId } = payload;
      socket.leave(getRequestRoomName(requestId));
    });

    socket.on(
      "chat:send",
      async (payload: {
        requestId: string;
        content: string;
        userId: string;
      }) => {
        try {
          if (!socket.user) return;

          const message = await createRequestMessageService(
            payload.requestId,
            socket.user?.sub,
            payload.content,
          );

          io?.to(getRequestRoomName(payload.requestId)).emit("chat:message", {
            requestId: payload.requestId,
            message,
          });
        } catch (error) {
          socket.emit("chat:error", {
            message:
              error instanceof Error ? error.message : "Failed to send message",
          });
        }
      },
    );
  });

  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
}

export function emitUserNotification(
  userId: string,
  payload: {
    type:
      | "new_message"
      | "proposal_received"
      | "proposal_accepted"
      | "proposal_rejected"
      | "request_status_changed"
      | "workplan_submitted"
      | "workplan_approved";
    title: string;
    message: string;
    requestId?: string;
    proposalId?: string;
    createdAt?: string;
  },
) {
  getIo()
    .to(getUserRoomName(userId))
    .emit("notification:new", {
      ...payload,
      createdAt: payload.createdAt ?? new Date().toISOString(),
    });
}
