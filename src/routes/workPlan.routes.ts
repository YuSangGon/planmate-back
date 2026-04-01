import { Router } from "express";
import {
  approveTravellerPreviewPlanController,
  getPlannerWorkPlan,
  getTravellerPreviewPlanController,
  submitPlannerWorkPlan,
  updatePlannerWorkPlan,
  createPlan,
  getPlanInfo,
  editWorkPlan,
  completeWorkPlan,
  getPreviewPlanController,
  getPlanController,
  getPreviewRequestPlanController,
  getRequestPlanController,
} from "../controllers/workPlan.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import {
  createPlanSchema,
  updateWorkPlanSchema,
} from "../schemas/workPlan.schema";

const router = Router();

router.get("/:requestId", requireAuth, getPlannerWorkPlan);
router.post("/create", requireAuth, validateBody(createPlanSchema), createPlan);
router.get("/create/:planId", requireAuth, getPlanInfo);

router.patch(
  "/:requestId",
  requireAuth,
  validateBody(updateWorkPlanSchema),
  updatePlannerWorkPlan,
);

router.patch(
  "/edit/:planId",
  requireAuth,
  validateBody(updateWorkPlanSchema),
  editWorkPlan,
);

router.post("/:requestId/submit", requireAuth, submitPlannerWorkPlan);
router.post("/complete/:planId", requireAuth, completeWorkPlan);

router.get(
  "/:requestId/preview-plan",
  requireAuth,
  getTravellerPreviewPlanController,
);

router.get("/preview-plan/:planId", getPreviewPlanController);
router.get(
  "/preview-request-plan/:planId",
  requireAuth,
  getPreviewRequestPlanController,
);
router.get("/detail/:planId", requireAuth, getPlanController);

router.get("/request-detail/:requestId", requireAuth, getRequestPlanController);

router.post(
  "/:requestId/preview-plan/approve",
  requireAuth,
  approveTravellerPreviewPlanController,
);

export default router;
