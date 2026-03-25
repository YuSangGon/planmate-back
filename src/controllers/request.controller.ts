import type { Request, Response } from "express";
import {
  completeRequest,
  createTripRequest,
  getRequestDetailById,
  getRequestList,
  getMyRequestList,
} from "../services/request.service";

export async function getRequests(req: Request, res: Response) {
  // const userId = req.auth?.sub;

  // if (!userId) {
  //   res.status(401).json({
  //     success: false,
  //     message: "Unauthorized",
  //   });
  //   return;
  // }

  const data = await getRequestList();

  res.json({
    success: true,
    data,
  });
}

export async function getMyRequests(req: Request, res: Response) {
  const userId = req.auth?.sub;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const data = await getMyRequestList(userId);

  res.json({
    success: true,
    data,
  });
}

export async function getMyRequestDetail(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  const requestItem = await getRequestDetailById({
    requestId: req.params.requestId as string,
    plannerId,
  });

  if (!requestItem) {
    res.status(404).json({
      success: false,
      message: "Request not found",
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
      requestId: req.params.requestId as string,
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
