import type { Request, Response } from "express";
import {
  deleteSentProposal,
  getSentProposalDetail,
  getSentProposalsForPlanner,
  updateSentProposal,
  withdrawAcceptedProposal,
} from "../services/proposal.service";
import {
  acceptReceivedDirectProposal,
  getReceivedDirectProposalDetail,
  getReceivedDirectProposalsForPlanner,
  rejectReceivedDirectProposal,
} from "../services/directProposal.service";

export async function getPlannerSentProposalList(req: Request, res: Response) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const data = await getSentProposalsForPlanner(plannerId);
  res.json({ success: true, data });
}

export async function getPlannerReceivedProposalList(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const data = await getReceivedDirectProposalsForPlanner(plannerId);
  res.json({ success: true, data });
}

export async function getPlannerSentProposalDetailController(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await getSentProposalDetail(req.params.proposalId, plannerId);
    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load proposal detail";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function updatePlannerSentProposalController(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await updateSentProposal({
      proposalId: req.params.proposalId,
      plannerId,
      ...req.body,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update proposal";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function deletePlannerSentProposalController(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await deleteSentProposal({
      proposalId: req.params.proposalId,
      plannerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete proposal";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function withdrawPlannerSentProposalController(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await withdrawAcceptedProposal({
      proposalId: req.params.proposalId,
      plannerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to withdraw proposal";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function getPlannerReceivedProposalDetailController(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await getReceivedDirectProposalDetail(
      req.params.proposalId,
      plannerId,
    );
    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load proposal detail";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function acceptPlannerReceivedProposalController(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await acceptReceivedDirectProposal({
      proposalId: req.params.proposalId,
      plannerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to accept received proposal";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}

export async function rejectPlannerReceivedProposalController(
  req: Request,
  res: Response,
) {
  const plannerId = req.auth?.sub;

  if (!plannerId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const data = await rejectReceivedDirectProposal({
      proposalId: req.params.proposalId,
      plannerId,
    });

    res.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to reject received proposal";

    res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      message,
    });
  }
}
