import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;
  if (!name) { res.status(400); throw new Error("Project name required"); }
  const project = await Project.create({ name, description, createdBy: req.user._id, members: members || [] });
  res.status(201).json(project);
});

export const getProjects = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role !== "Admin") {
    filter = { $or: [{ createdBy: req.user._id }, { members: req.user._id }] };
  }
  const projects = await Project.find(filter)
    .populate("createdBy", "name email")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });
  res.json(projects);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("members", "name email role");
  if (!project) { res.status(404); throw new Error("Project not found"); }
  res.json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  const { name, description, members } = req.body;
  project.name = name || project.name;
  project.description = description ?? project.description;
  if (members) project.members = members;
  const updated = await project.save();
  res.json(updated);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: "Project removed" });
});
