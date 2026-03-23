import { Router } from "express";
import {
  getPlannerDetail,
  getPlannerList,
} from "../controllers/planner.controller";
import { createPlannerDirectProposal } from "../controllers/directProposal.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createDirectProposalSchema } from "../schemas/directProposal.schema";

const router = Router();

router.get("/", getPlannerList);
router.get("/:plannerId", getPlannerDetail);

router.post(
  "/:plannerId/direct-proposals",
  requireAuth,
  requireRole(["traveller"]),
  validateBody(createDirectProposalSchema),
  createPlannerDirectProposal,
);

export default router;
