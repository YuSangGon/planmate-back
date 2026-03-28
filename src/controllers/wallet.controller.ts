import type { Request, Response } from "express";
import {
  getMyCoinBalance,
  purchaseCoins,
  getItemLists,
} from "../services/wallet.service";
import { success } from "zod";

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
      itemCode: req.body.itemCode,
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

export async function getShopItems(req: Request, res: Response) {
  const userId = req.auth?.sub;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const data = await getItemLists();

  res.json({
    success: true,
    data: data,
  });

  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get item list",
    });
  }
}
