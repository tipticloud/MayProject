import express from "express";
import { createTask, getTasks, getMyTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, getTasks).post(protect, adminOnly, createTask);
router.get("/my-tasks", protect, getMyTasks);
router.route("/:id").put(protect, updateTask).delete(protect, adminOnly, deleteTask);
export default router;
