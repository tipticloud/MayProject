import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, getProjects).post(protect, adminOnly, createProject);
router.route("/:id").get(protect, getProjectById).put(protect, adminOnly, updateProject).delete(protect, adminOnly, deleteProject);
export default router;
