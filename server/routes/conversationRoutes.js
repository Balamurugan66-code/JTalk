import express from "express";
import { getConversations } from "../controllers/conversationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getConversations);

export default router;