import type { Request, Response } from "express";
import {
  acceptProposal,
  createProposal,
  getProposalsForTravellerRequest,
  rejectProposal,
} from "../services/proposal.service";

export async function createRequestProposal(req: Request, res: Response) {
  const plannerId = req.auth?.sub;
  const requestId = req.params.requestId;

  if (!plannerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const proposal = await createProposal({
      requestId,
      plannerId,
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
        error instanceof Error ? error.message : "Failed to create proposal",
    });
  }
}

export async function getRequestProposals(req: Request, res: Response) {
  const travellerId = req.auth?.sub;
  const requestId = req.params.requestId;

  if (!travellerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const proposals = await getProposalsForTravellerRequest({
      requestId,
      travellerId,
    });

    res.json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get proposals";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function acceptRequestProposal(req: Request, res: Response) {
  const travellerId = req.auth?.sub;
  const proposalId = req.params.proposalId;

  if (!travellerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const result = await acceptProposal({
      proposalId,
      travellerId,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to accept proposal";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function rejectRequestProposal(req: Request, res: Response) {
  const travellerId = req.auth?.sub;
  const proposalId = req.params.proposalId;

  if (!travellerId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const result = await rejectProposal({
      proposalId,
      travellerId,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reject proposal";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}
