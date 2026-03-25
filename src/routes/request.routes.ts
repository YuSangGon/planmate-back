import { Router } from "express";
import {
  completeTravellerRequest,
  createRequest,
  getRequests,
  getMyRequestDetail,
  getMyRequests,
} from "../controllers/request.controller";
import { getRequestProposals } from "../controllers/proposal.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createRequestSchema } from "../schemas/request.schema";

const router = Router();

router.get("/", getRequests);

router.get("/mine", requireAuth, getMyRequests);
router.get("/mine/:requestId", requireAuth, getMyRequestDetail);

router.get("/:requestId/proposals", requireAuth, getRequestProposals);

router.post("/", requireAuth, validateBody(createRequestSchema), createRequest);

router.post("/:requestId/complete", requireAuth, completeTravellerRequest);

export default router;
