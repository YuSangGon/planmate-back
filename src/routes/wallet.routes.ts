import { Router } from "express";
import {
  buyCoinPackage,
  getWalletBalance,
} from "../controllers/wallet.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/balance", requireAuth, getWalletBalance);
router.post("/purchase", requireAuth, buyCoinPackage);

export default router;
