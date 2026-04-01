import { Router } from "express";
import { login, signup, changePassword } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate.middleware";
import {
  loginSchema,
  signupSchema,
  passwordSchema,
} from "../schemas/auth.schema";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", validateBody(signupSchema), signup);
router.post("/login", validateBody(loginSchema), login);
router.post(
  "/change-password",
  validateBody(passwordSchema),
  requireAuth,
  changePassword,
);

export default router;
