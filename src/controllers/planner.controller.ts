import type { Request, Response } from "express";
import {
  getPlannerById,
  getPlanners,
  getPlannersTop3,
} from "../services/planner.service";

export async function getPlannerList(_req: Request, res: Response) {
  try {
    const planners = await getPlanners();

    res.json({
      success: true,
      data: planners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch planners",
    });
  }
}

export async function getPlannerTop3(_req: Request, res: Response) {
  try {
    const planners = await getPlannersTop3();

    res.json({
      success: true,
      data: planners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch planners",
    });
  }
}

export async function getPlannerDetail(req: Request, res: Response) {
  try {
    const planner = await getPlannerById(req.params.plannerId as string);

    if (!planner) {
      res.status(404).json({
        success: false,
        message: "Planner not found",
      });
      return;
    }

    res.json({
      success: true,
      data: planner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch planner detail",
    });
  }
}
