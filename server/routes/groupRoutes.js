import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

import {
  createGroup,
  getGroups,
  deleteGroup,
  removeMember,
} from "../controllers/groupController.js";

import {
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/groupMessageController.js";

const router = express.Router();

// ======================
// Groups
// ======================

router.post("/", authMiddleware, createGroup);

router.get("/", authMiddleware, getGroups);

router.patch(
  "/:id/remove-member",
  authMiddleware,
  removeMember
);

router.delete("/:id", authMiddleware, deleteGroup);

// ======================
// Group Messages
// ======================

router.get(
  "/:groupId/messages",
  authMiddleware,
  getGroupMessages
);

router.post(
  "/:groupId/messages",
  authMiddleware,
  upload.single("image"),
  sendGroupMessage
);

export default router;