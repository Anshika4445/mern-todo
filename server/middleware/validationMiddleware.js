const allowedStatuses = ["Pending", "In-Progress", "Completed"];
const allowedPriorities = ["Low", "Medium", "High"];

function validateTask(req, res, next) {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = [];

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    errors.push("Title is required and must be a non-empty string");
  }
  if (
    title !== undefined &&
    typeof title === "string" &&
    title.trim().length > 120
  ) {
    errors.push("Title cannot exceed 120 characters");
  }
  if (description !== undefined && typeof description !== "string") {
    errors.push("Description must be a string");
  }
  if (
    description !== undefined &&
    typeof description === "string" &&
    description.length > 1000
  ) {
    errors.push("Description cannot exceed 1000 characters");
  }
  if (status !== undefined && !allowedStatuses.includes(status)) {
    errors.push("Status must be Pending, In-Progress, or Completed");
  }
  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    errors.push("Priority must be Low, Medium, or High");
  }
  if (
    dueDate !== undefined &&
    dueDate !== null &&
    dueDate !== "" &&
    Number.isNaN(Date.parse(dueDate))
  ) {
    errors.push("Due date must be a valid date");
  }

  if (errors.length)
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  next();
}

function validateCreateTask(req, res, next) {
  if (req.body.title === undefined) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Validation failed",
        errors: ["Title is required"],
      });
  }
  validateTask(req, res, next);
}

module.exports = { validateTask, validateCreateTask };
