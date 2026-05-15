import express from "express";
import { registerUser, loginUser, getUsers, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, getUsers);
router.get("/profile", protect, getProfile);
export default router;
