import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createReviewService,
  editReviewService,
  getPlannerReviewForRequestService,
} from "../services/review.service";
import type { PlannerReview } from "../types/review";

const router = express.Router();

router.get("/:requestId", requireAuth, async (req, res) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await getPlannerReviewForRequestService(
      req.params.requestId as string,
    );

    return res.status(201).json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get review";

    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden"
          ? 403
          : message === "Review not found"
            ? 404
            : 400;

    return res.status(status).json({ message });
  }
});

router.post("/planner", requireAuth, async (req, res) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const input = req.body as PlannerReview;
    const data = await createReviewService(req.auth.sub, input);

    return res.status(201).json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create review";

    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden" ||
            message === "Only travellers can write reviews"
          ? 403
          : message === "Request not found" || message === "Planner not found"
            ? 404
            : 400;

    return res.status(status).json({ message });
  }
});

router.patch("/planner", requireAuth, async (req, res) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const input = req.body as PlannerReview;
    const data = await editReviewService(req.auth.sub, input);

    return res.status(201).json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to edit review";

    const status =
      message === "Forbidden"
        ? 403
        : message === "Review not found"
          ? 404
          : 400;

    return res.status(status).json({ message });
  }
});

export default router;
