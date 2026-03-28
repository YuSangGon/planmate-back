import { Router } from "express";
import {
  approveTravellerPreviewPlanController,
  getPlannerWorkPlan,
  getTravellerPreviewPlanController,
  submitPlannerWorkPlan,
  updatePlannerWorkPlan,
} from "../controllers/workPlan.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { updateWorkPlanSchema } from "../schemas/workPlan.schema";

const router = Router();

router.get("/:requestId", requireAuth, getPlannerWorkPlan);

router.patch(
  "/:requestId",
  requireAuth,
  validateBody(updateWorkPlanSchema),
  updatePlannerWorkPlan,
);

router.post("/:requestId/submit", requireAuth, submitPlannerWorkPlan);

router.get(
  "/:requestId/preview-plan",
  requireAuth,
  getTravellerPreviewPlanController,
);

router.post(
  "/:requestId/preview-plan/approve",
  requireAuth,
  approveTravellerPreviewPlanController,
);

export default router;
