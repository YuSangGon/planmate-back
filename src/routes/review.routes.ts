import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { createReviewService } from "../services/review.service";
import type { CreateReviewInput } from "../types/review";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "traveller") {
      return res
        .status(403)
        .json({ message: "Only travellers can write reviews" });
    }

    const input = req.body as CreateReviewInput;
    const data = await createReviewService(req.user.id, input);

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

export default router;
