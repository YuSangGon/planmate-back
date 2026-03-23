import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import planRoutes from "./plan.routes";
import requestRoutes from "./request.routes";
import proposalRoutes from "./proposal.routes";
import plannerRoutes from "./planner.routes";
import dashboardRoutes from "./dashboard.routes";
import walletRoutes from "./wallet.routes";
import plannerProposalRoutes from "./plannerProposal.routes";
import workPlanRoutes from "./workPlan.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/plans", planRoutes);
router.use("/requests", requestRoutes);
router.use("/proposals", proposalRoutes);
router.use("/planners", plannerRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/wallet", walletRoutes);
router.use("/planner-proposals", plannerProposalRoutes);
router.use("/requests", workPlanRoutes);

export default router;
