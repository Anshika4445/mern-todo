const mongoose = require("mongoose");
const Task = require("../models/Task");

const STATUSES = ["Pending", "In-Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];
const SORT_FIELDS = ["createdAt", "updatedAt", "dueDate", "title", "priority"];

function validId(id) {
  return mongoose.isValidObjectId(id);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.getStats = async (req, res) => {
  const [total, pending, inProgress, completed] = await Promise.all([
    Task.countDocuments({ user: req.user._id }),
    Task.countDocuments({ user: req.user._id, status: "Pending" }),
    Task.countDocuments({ user: req.user._id, status: "In-Progress" }),
    Task.countDocuments({ user: req.user._id, status: "Completed" }),
  ]);

  res.json({ success: true, stats: { total, pending, inProgress, completed } });
};

exports.getTasks = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const filter = { user: req.user._id };

  if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (PRIORITIES.includes(req.query.priority))
    filter.priority = req.query.priority;

  if (req.query.search?.trim()) {
    const search = new RegExp(escapeRegex(req.query.search.trim()), "i");
    filter.$or = [{ title: search }, { description: search }];
  }

  const sortField = SORT_FIELDS.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";
  const sort = { [sortField]: req.query.order === "asc" ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    success: true,
    tasks,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

exports.getTask = async (req, res) => {
  if (!validId(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid task id" });
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });
  res.json({ success: true, task });
};

exports.createTask = async (req, res) => {
  const task = await Task.create({
    title: req.body.title.trim(),
    description: req.body.description?.trim() || "",
    status: req.body.status || "Pending",
    priority: req.body.priority || "Medium",
    dueDate: req.body.dueDate || null,
    user: req.user._id,
  });
  res.status(201).json({ success: true, task });
};

exports.updateTask = async (req, res) => {
  if (!validId(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid task id" });

  const allowed = ["title", "description", "status", "priority", "dueDate"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key)),
  );
  if (updates.title !== undefined) updates.title = updates.title.trim();
  if (updates.description !== undefined)
    updates.description = updates.description.trim();
  if (updates.dueDate === "") updates.dueDate = null;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true },
  );

  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });
  res.json({ success: true, task });
};

exports.updateStatus = async (req, res) => {
  if (!STATUSES.includes(req.body.status)) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid status",
        errors: ["Status must be Pending, In-Progress, or Completed"],
      });
  }
  req.body = { status: req.body.status };
  return exports.updateTask(req, res);
};

exports.deleteTask = async (req, res) => {
  if (!validId(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid task id" });
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });
  res.json({ success: true, message: "Task deleted" });
};
