require("express-async-errors");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "TaskFlow API is running" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
