import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { SocketJwtPayload } from "../types/socket";

type AuthedSocket = Socket & {
  user?: SocketJwtPayload;
};

export function socketAuth(socket: AuthedSocket, next: (err?: Error) => void) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, env.jwtAccessSecret) as SocketJwtPayload;
    socket.user = decoded;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}
