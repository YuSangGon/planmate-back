import { Router } from "express";
import {
  createPlannerPlan,
  deletePlannerPlan,
  getMyPlans,
  getPlanDetail,
  getPlans,
  updatePlannerPlan,
} from "../controllers/plan.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createPlanSchema } from "../schemas/plan.schema";

const router = Router();

router.get("/", getPlans);
router.get("/me", requireAuth, requireRole(["planner"]), getMyPlans);
router.get("/:planId", getPlanDetail);

router.post(
  "/",
  requireAuth,
  requireRole(["planner"]),
  validateBody(createPlanSchema),
  createPlannerPlan,
);

router.patch(
  "/:planId",
  requireAuth,
  requireRole(["planner"]),
  validateBody(createPlanSchema),
  updatePlannerPlan,
);

router.delete(
  "/:planId",
  requireAuth,
  requireRole(["planner"]),
  deletePlannerPlan,
);

export default router;
