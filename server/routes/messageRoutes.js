import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  reactToMessage,
} from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  sendMessage
);

router.get("/:id", authMiddleware, getMessages);

router.delete(
  "/:id",
  authMiddleware,
  deleteMessage
);

router.post(
  "/:id/react",
  authMiddleware,
  reactToMessage
);

export default router;