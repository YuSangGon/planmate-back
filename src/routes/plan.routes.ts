import { Router } from "express";
import {
  createPlannerPlan,
  deletePlannerPlan,
  getMyPlans,
  getPlanDetail,
  getPlans,
  updatePlannerPlan,
  purchasePlan,
  getPlansTop3,
} from "../controllers/plan.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createPlanSchema } from "../schemas/plan.schema";

const router = Router();

router.get("/", getPlans);
router.get("/top3", getPlansTop3);
router.get("/me", requireAuth, getMyPlans);
router.get("/:planId", requireAuth, getPlanDetail);

router.post(
  "/",
  requireAuth,
  validateBody(createPlanSchema),
  createPlannerPlan,
);

router.post("/purchase", requireAuth, purchasePlan);

router.patch(
  "/:planId",
  requireAuth,
  validateBody(createPlanSchema),
  updatePlannerPlan,
);

router.delete("/:planId", requireAuth, deletePlannerPlan);

export default router;
