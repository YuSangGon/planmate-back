import type { Request, Response } from "express";
import { createDirectProposal } from "../services/directProposal.service";

export async function createPlannerDirectProposal(req: Request, res: Response) {
  const travellerId = req.auth?.sub;
  const plannerId = req.params.plannerId;

  if (!travellerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const proposal = await createDirectProposal({
      plannerId,
      travellerId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create direct proposal",
    });
  }
}
