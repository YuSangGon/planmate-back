import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createProposalSchema } from "../schemas/proposal.schema";
import {
  acceptPlannerReceivedProposalController,
  deletePlannerSentProposalController,
  getPlannerReceivedProposalDetailController,
  getPlannerReceivedProposalList,
  getPlannerSentProposalDetailController,
  getPlannerSentProposalList,
  rejectPlannerReceivedProposalController,
  updatePlannerSentProposalController,
  withdrawPlannerSentProposalController,
} from "../controllers/plannerProposal.controller";

const router = Router();

router.get(
  "/sent",
  requireAuth,
  requireRole(["planner"]),
  getPlannerSentProposalList,
);

router.get(
  "/received",
  requireAuth,
  requireRole(["planner"]),
  getPlannerReceivedProposalList,
);

router.get(
  "/sent/:proposalId",
  requireAuth,
  requireRole(["planner"]),
  getPlannerSentProposalDetailController,
);

router.patch(
  "/sent/:proposalId",
  requireAuth,
  requireRole(["planner"]),
  validateBody(createProposalSchema),
  updatePlannerSentProposalController,
);

router.delete(
  "/sent/:proposalId",
  requireAuth,
  requireRole(["planner"]),
  deletePlannerSentProposalController,
);

router.post(
  "/sent/:proposalId/withdraw",
  requireAuth,
  requireRole(["planner"]),
  withdrawPlannerSentProposalController,
);

router.get(
  "/received/:proposalId",
  requireAuth,
  requireRole(["planner"]),
  getPlannerReceivedProposalDetailController,
);

router.post(
  "/received/:proposalId/accept",
  requireAuth,
  requireRole(["planner"]),
  acceptPlannerReceivedProposalController,
);

router.post(
  "/received/:proposalId/reject",
  requireAuth,
  requireRole(["planner"]),
  rejectPlannerReceivedProposalController,
);

export default router;
