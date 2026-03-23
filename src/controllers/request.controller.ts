import type { Request, Response } from "express";
import {
  completeRequest,
  createTripRequest,
  getOpenRequestById,
  getOpenRequestsForPlanner,
  getRequestsForTraveller,
} from "../services/request.service";

export async function getMyRequests(req: Request, res: Response) {
  const userId = req.auth?.sub;
  const role = req.auth?.role;

  if (!userId || !role) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const data =
    role === "planner"
      ? await getOpenRequestsForPlanner()
      : await getRequestsForTraveller(userId);

  res.json({
    success: true,
    data,
  });
}

export async function getOpenRequests(_req: Request, res: Response) {
  const data = await getOpenRequestsForPlanner();

  res.json({
    success: true,
    data,
  });
}

export async function getOpenRequestDetail(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  const requestItem = await getOpenRequestById({
    requestId: req.params.requestId,
    plannerId,
  });

  if (!requestItem) {
    res.status(404).json({
      success: false,
      message: "Open request not found",
    });
    return;
  }

  res.json({
    success: true,
    data: requestItem,
  });
}

export async function createRequest(req: Request, res: Response) {
  const travellerId = req.auth?.sub;

  if (!travellerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const request = await createTripRequest({
      travellerId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create request",
    });
  }
}

export async function completeTravellerRequest(req: Request, res: Response) {
  const travellerId = req.auth?.sub;

  if (!travellerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const request = await completeRequest({
      requestId: req.params.requestId,
      travellerId,
    });

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to complete request";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}
