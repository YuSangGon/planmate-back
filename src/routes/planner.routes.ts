import { Router } from "express";
import {
  getPlannerDetail,
  getPlannerList,
} from "../controllers/planner.controller";
import { createPlannerDirectProposal } from "../controllers/directProposal.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createDirectProposalSchema } from "../schemas/directProposal.schema";

const router = Router();

router.get("/", getPlannerList);
router.get("/:plannerId", getPlannerDetail);

router.post(
  "/:plannerId/direct-proposals",
  requireAuth,
  validateBody(createDirectProposalSchema),
  createPlannerDirectProposal,
);

export default router;
