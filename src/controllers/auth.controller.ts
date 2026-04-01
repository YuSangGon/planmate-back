import type { Request, Response } from "express";
import {
  loginUser,
  signupUser,
  changePasswordService,
} from "../services/auth.service";

export async function signup(req: Request, res: Response) {
  try {
    const result = await signupUser(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.auth?.sub as string;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    console.log(req.body);

    const result = await changePasswordService(
      userId,
      req.body.newPassword,
      req.body.originalPassword,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Password change failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
}
