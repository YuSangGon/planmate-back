import { Router } from "express";
import {
  buyCoinPackage,
  getWalletBalance,
} from "../controllers/wallet.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

const router = Router();

router.get("/balance", requireAuth, getWalletBalance);
router.post(
  "/purchase",
  requireAuth,
  requireRole(["traveller"]),
  buyCoinPackage,
);

export default router;
