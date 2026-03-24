import type { Request, Response } from "express";
import {
  approveSubmittedPlan,
  getOrCreateWorkPlan,
  getTravellerPreviewPlan,
  submitWorkPlan,
  updateWorkPlan,
} from "../services/workPlan.service";

export async function getPlannerWorkPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await getOrCreateWorkPlan({
      requestId: req.params.requestId as string,
      plannerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load work plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function updatePlannerWorkPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await updateWorkPlan({
      requestId: req.params.requestId,
      plannerId,
      ...req.body,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update work plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function submitPlannerWorkPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await submitWorkPlan({
      requestId: req.params.requestId as string,
      plannerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit work plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function getTravellerPreviewPlanController(
  req: Request,
  res: Response,
) {
  const travellerId = req.auth?.sub;

  if (!travellerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await getTravellerPreviewPlan({
      requestId: req.params.requestId as string,
      travellerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load preview plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function approveTravellerPreviewPlanController(
  req: Request,
  res: Response,
) {
  const travellerId = req.auth?.sub;

  if (!travellerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await approveSubmittedPlan({
      requestId: req.params.requestId as string,
      travellerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to approve plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}
