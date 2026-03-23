import { Router } from "express";
import {
  completeTravellerRequest,
  createRequest,
  getMyRequests,
  getOpenRequestDetail,
  getOpenRequests,
} from "../controllers/request.controller";
import { getRequestProposals } from "../controllers/proposal.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createRequestSchema } from "../schemas/request.schema";

const router = Router();

router.get("/", requireAuth, getMyRequests);

router.get("/open", requireAuth, requireRole(["planner"]), getOpenRequests);
router.get(
  "/open/:requestId",
  requireAuth,
  requireRole(["planner"]),
  getOpenRequestDetail,
);

router.get(
  "/:requestId/proposals",
  requireAuth,
  requireRole(["traveller"]),
  getRequestProposals,
);

router.post(
  "/",
  requireAuth,
  requireRole(["traveller"]),
  validateBody(createRequestSchema),
  createRequest,
);

router.post(
  "/:requestId/complete",
  requireAuth,
  requireRole(["traveller"]),
  completeTravellerRequest,
);

export default router;
