import { Router } from "express";
import {
  approveTravellerPreviewPlanController,
  getPlannerWorkPlan,
  getTravellerPreviewPlanController,
  submitPlannerWorkPlan,
  updatePlannerWorkPlan,
} from "../controllers/workPlan.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { updateWorkPlanSchema } from "../schemas/workPlan.schema";

const router = Router();

router.get(
  "/:requestId/work-plan",
  requireAuth,
  requireRole(["planner"]),
  getPlannerWorkPlan,
);

router.patch(
  "/:requestId/work-plan",
  requireAuth,
  requireRole(["planner"]),
  validateBody(updateWorkPlanSchema),
  updatePlannerWorkPlan,
);

router.post(
  "/:requestId/work-plan/submit",
  requireAuth,
  requireRole(["planner"]),
  submitPlannerWorkPlan,
);

router.get(
  "/:requestId/preview-plan",
  requireAuth,
  requireRole(["traveller"]),
  getTravellerPreviewPlanController,
);

router.post(
  "/:requestId/preview-plan/approve",
  requireAuth,
  requireRole(["traveller"]),
  approveTravellerPreviewPlanController,
);

export default router;
