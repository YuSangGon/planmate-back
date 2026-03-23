import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/token.service";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
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
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
