import { Router } from "express";
import {
  getPlannerOwnPlans,
  getPlannerReceivedDirectProposals,
  // getPlannerReceivedReviews,
  getPlannerSentProposals,
} from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/planner/sent-proposals", requireAuth, getPlannerSentProposals);

router.get(
  "/planner/received-direct-proposals",
  requireAuth,
  getPlannerReceivedDirectProposals,
);

router.get("/planner/plans", requireAuth, getPlannerOwnPlans);

// TODO : 리뷰 끌어오는 부분
// router.get(
//   "/planner/reviews",
//   requireAuth,
//   getPlannerReceivedReviews,
// );

export default router;
