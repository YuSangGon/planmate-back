import type { Request, Response } from "express";
import { getMyCoinBalance, purchaseCoins } from "../services/wallet.service";

export async function getWalletBalance(req: Request, res: Response) {
  const userId = req.auth?.sub;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const data = await getMyCoinBalance(userId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to load wallet",
    });
  }
}

export async function buyCoinPackage(req: Request, res: Response) {
  const userId = req.auth?.sub;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const data = await purchaseCoins({
      userId,
      packageId: req.body.packageId,
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to purchase coins",
    });
  }
}
