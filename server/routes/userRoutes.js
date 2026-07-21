import express from "express";
import {
  getUsers,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", protect, getUsers);

router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  updateProfile
);

export default router;