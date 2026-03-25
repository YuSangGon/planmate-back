import { Router } from "express";
import {
  acceptRequestProposal,
  createRequestProposal,
  rejectRequestProposal,
} from "../controllers/proposal.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createProposalSchema } from "../schemas/proposal.schema";

const router = Router();

router.post("/:proposalId/accept", requireAuth, acceptRequestProposal);

router.post(
  "/requests/:requestId",
  requireAuth,
  validateBody(createProposalSchema),
  createRequestProposal,
);

router.post("/:proposalId/reject", requireAuth, rejectRequestProposal);

export default router;
