import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
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

router.get("/sent", requireAuth, getPlannerSentProposalList);

router.get("/received", requireAuth, getPlannerReceivedProposalList);

router.get(
  "/sent/:proposalId",
  requireAuth,
  getPlannerSentProposalDetailController,
);

router.patch(
  "/sent/:proposalId",
  requireAuth,
  validateBody(createProposalSchema),
  updatePlannerSentProposalController,
);

router.delete(
  "/sent/:proposalId",
  requireAuth,
  deletePlannerSentProposalController,
);

router.post(
  "/sent/:proposalId/withdraw",
  requireAuth,
  withdrawPlannerSentProposalController,
);

router.get(
  "/received/:proposalId",
  requireAuth,
  getPlannerReceivedProposalDetailController,
);

router.post(
  "/received/:proposalId/accept",
  requireAuth,
  acceptPlannerReceivedProposalController,
);

router.post(
  "/received/:proposalId/reject",
  requireAuth,
  rejectPlannerReceivedProposalController,
);

export default router;
