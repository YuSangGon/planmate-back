import type { Request, Response } from "express";
import { getCurrentUser } from "../services/user.service";

export async function getMe(req: Request, res: Response) {
  const userId = req.auth?.sub;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const user = await getCurrentUser(userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
}
