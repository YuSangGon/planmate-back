import type { Request, Response } from "express";
import {
  createPlan,
  deletePlan,
  getPlanById,
  getPlansForPlanner,
  getPublicPlans,
  updatePlan,
} from "../services/plan.service";

export async function getPlans(_req: Request, res: Response) {
  const data = await getPublicPlans();

  res.json({
    success: true,
    data,
  });
}

export async function getMyPlans(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const data = await getPlansForPlanner(plannerId);

  res.json({
    success: true,
    data,
  });
}

export async function getPlanDetail(req: Request, res: Response) {
  const plan = await getPlanById(req.params.planId as string);

  if (!plan) {
    res.status(404).json({
      success: false,
      message: "Plan not found",
    });
    return;
  }

  res.json({
    success: true,
    data: plan,
  });
}

export async function createPlannerPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const plan = await createPlan({
    plannerId,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    data: plan,
  });
}

export async function updatePlannerPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const plan = await updatePlan({
      planId: req.params.planId,
      plannerId,
      ...req.body,
    });

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function deletePlannerPlan(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const result = await deletePlan(req.params.planId as string, plannerId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete plan";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}
