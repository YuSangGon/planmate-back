import { Router } from "express";
import {
  acceptRequestProposal,
  createRequestProposal,
  rejectRequestProposal,
} from "../controllers/proposal.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createProposalSchema } from "../schemas/proposal.schema";

const router = Router();

router.post(
  "/:proposalId/accept",
  requireAuth,
  requireRole(["traveller"]),
  acceptRequestProposal,
);

router.post(
  "/requests/:requestId",
  requireAuth,
  requireRole(["planner"]),
  validateBody(createProposalSchema),
  createRequestProposal,
);

router.post(
  "/:proposalId/reject",
  requireAuth,
  requireRole(["traveller"]),
  rejectRequestProposal,
);

export default router;
