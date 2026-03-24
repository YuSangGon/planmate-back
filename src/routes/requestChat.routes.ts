import express from "express";
import {
  createRequestMessageService,
  getRequestMessagesService,
  getMyChatRoomsService,
} from "../services/requestChatService";
import { requireAuth } from "../middlewares/auth.middleware";
import { getIo } from "../lib/socket";

const router = express.Router();

router.get("/chatRooms", requireAuth, async (req, res) => {
  try {
    const userId = req.auth?.sub as string;

    const data = await getMyChatRoomsService(userId);
    return res.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load chat rooms";
    return res.status(400).json({ message });
  }
});

router.get("/:requestId/messages", requireAuth, async (req, res) => {
  try {
    const requestId = req.params.requestId as string;
    const userId = req.auth?.sub as string;
    const data = await getRequestMessagesService(requestId, userId);

    return res.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load messages";

    const status =
      message === "Request not found"
        ? 404
        : message === "Forbidden"
          ? 403
          : 400;

    return res.status(status).json({ message });
  }
});

router.post("/:requestId/messages", requireAuth, async (req, res) => {
  try {
    const requestId = req.params.requestId as string;
    const userId = req.auth?.sub as string;
    const { content } = req.body as { content?: string };

    const data = await createRequestMessageService(
      requestId,
      userId,
      content ?? "",
    );

    getIo().to(`request:${requestId}`).emit("chat:message", {
      requestId,
      message: data,
    });

    return res.status(201).json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send message";

    const status =
      message === "Request not found"
        ? 404
        : message === "Forbidden" || message === "This chat is read-only now"
          ? 403
          : 400;

    return res.status(status).json({ message });
  }
});

export default router;
