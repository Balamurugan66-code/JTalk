import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
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

export default router;