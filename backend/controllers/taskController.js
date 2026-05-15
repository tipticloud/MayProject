import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignedTo, status, priority, dueDate } = req.body;
  if (!title || !project) { res.status(400); throw new Error("Title and project required"); }
  const task = await Task.create({ title, description, project, assignedTo, status, priority, dueDate, createdBy: req.user._id });
  const populated = await Task.findById(task._id).populate("assignedTo", "name email").populate("project", "name");
  res.status(201).json(populated);
});

export const getTasks = asyncHandler(async (req, res) => {
  const { project } = req.query;
  let filter = {};
  if (project) filter.project = project;
  if (req.user.role !== "Admin" && !project) filter.assignedTo = req.user._id;
  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("project", "name")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  res.json(tasks);
});

export const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id }).populate("project", "name").sort({ dueDate: 1 });
  const now = new Date();
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "Todo").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "Done").length,
  };
  res.json({ tasks, stats });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }
  if (req.user.role !== "Admin") {
    if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403); throw new Error("Not authorized to update this task");
    }
    task.status = req.body.status || task.status;
  } else {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;
    task.title = title || task.title;
    task.description = description ?? task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
  }
  const updated = await task.save();
  const populated = await Task.findById(updated._id).populate("assignedTo", "name email").populate("project", "name");
  res.json(populated);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }
  await task.deleteOne();
  res.json({ message: "Task removed" });
});
