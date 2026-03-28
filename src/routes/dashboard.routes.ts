import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  getDashboardOverviewService,
  getDashboardRequestsService,
  getDashboardProposalsService,
  getDashboardPlansService,
} from "../services/dashboard.service";

const router = express.Router();

router.use(requireAuth);

router.get("/overview", async (req, res) => {
  try {
    const userId = req.auth!.sub;
    const data = await getDashboardOverviewService(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load dashboard overview";

    return res.status(500).json({ success: false, message });
  }
});

router.get("/requests", async (req, res) => {
  try {
    const userId = req.auth!.sub;
    const data = await getDashboardRequestsService(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load active requests";

    return res.status(500).json({ success: false, message });
  }
});

router.get("/proposals", async (req, res) => {
  try {
    const userId = req.auth!.sub;
    const data = await getDashboardProposalsService(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load received proposals";

    return res.status(500).json({ success: false, message });
  }
});

router.get("/plans", async (req, res) => {
  try {
    const userId = req.auth!.sub;
    const data = await getDashboardPlansService(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load dashboard plans";

    return res.status(500).json({ success: false, message });
  }
});

export default router;
