import { Router } from "express";
import {
  getPlannerOwnPlans,
  getPlannerReceivedDirectProposals,
  getPlannerReceivedReviews,
  getPlannerSentProposals,
} from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

const router = Router();

router.get(
  "/planner/sent-proposals",
  requireAuth,
  requireRole(["planner"]),
  getPlannerSentProposals,
);

router.get(
  "/planner/received-direct-proposals",
  requireAuth,
  requireRole(["planner"]),
  getPlannerReceivedDirectProposals,
);

router.get(
  "/planner/plans",
  requireAuth,
  requireRole(["planner"]),
  getPlannerOwnPlans,
);

router.get(
  "/planner/reviews",
  requireAuth,
  requireRole(["planner"]),
  getPlannerReceivedReviews,
);

export default router;
