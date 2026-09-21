const router = require("express").Router();
const c = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const {
  validateTask,
  validateCreateTask,
} = require("../middleware/validationMiddleware");

router.use(protect);
router.get("/stats", c.getStats);
router.get("/", c.getTasks);
router.get("/:id", c.getTask);
router.post("/", validateCreateTask, c.createTask);
router.put("/:id", validateTask, c.updateTask);
router.patch("/:id/status", validateTask, c.updateStatus);
router.delete("/:id", c.deleteTask);

module.exports = router;
