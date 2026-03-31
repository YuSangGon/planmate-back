import type { Request, Response } from "express";
import {
  approveSubmittedPlan,
  getOrCreateWorkPlan,
  getTravellerPreviewPlan,
  submitWorkPlan,
  updateWorkPlan,
  createWorkPlan,
  type PlanInfo,
  getWorkPlanInfo,
  editWorkPlanService,
  completeWorkPlanService,
  getPreviewPlan,
  getPlan,
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

export async function createPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await createWorkPlan({
      plannerId,
      data: req.body as PlanInfo,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to createe work plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function getPlanInfo(req: Request, res: Response) {
  const planId = req.params.planId as string;

  try {
    const data = await getWorkPlanInfo(planId);

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to createe work plan";

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

export async function editWorkPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await editWorkPlanService({
      planId: req.params.planId,
      plannerId,
      ...req.body,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to edit work plan";

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

export async function completeWorkPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await completeWorkPlanService({
      planId: req.params.planId as string,
      plannerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to complete work plan";

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

export async function getPreviewPlanController(req: Request, res: Response) {
  const planId = req.params.planId as string;

  try {
    const data = await getPreviewPlan(planId);

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

export async function getPlanController(req: Request, res: Response) {
  const planId = req.params.planId as string;
  const userId = req.auth?.sub as string;

  try {
    const data = await getPlan(planId, userId);

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
