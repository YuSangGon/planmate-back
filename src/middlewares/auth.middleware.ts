import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/token.service";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AuthRequest = Request & {
  user?: {
    id: string;
    email: string;
  };
};

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
    return;
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    req.auth = payload;
    const decoded = jwt.verify(token, env.jwtAccessSecret) as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
