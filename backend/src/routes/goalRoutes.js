const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/authMiddleware");

// ➡️ POST: Create a new goal
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { emoji, heading, description, dueYear, dueMonth, dueDay } = req.body;

    const goal = new Goal({
      user: req.user.id,
      emoji,
      heading,
      description,
      dueYear,
      dueMonth,
      dueDay,
      complete: false
    });

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ GET: Get all goals for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id })
      .sort({ dueYear: 1, dueMonth: 1, dueDay: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ GET: Get recent goals (last 5 by creation date)
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ GET: Get only pending goals (not completed yet)
router.get("/pending", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id, complete: false })
      .sort({ dueYear: 1, dueMonth: 1, dueDay: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ GET: Get overdue goals (not completed and due date has passed)
router.get("/overdue", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    const goals = await Goal.find({
      user: userId,
      complete: false,
      $or: [
        { dueYear: { $lt: currentYear } },
        { dueYear: currentYear, dueMonth: { $lt: currentMonth } },
        { dueYear: currentYear, dueMonth: currentMonth, dueDay: { $lt: currentDay } }
      ]
    }).sort({ dueYear: 1, dueMonth: 1, dueDay: 1 });

    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ PUT: Mark goal as completed
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const done = new Date();
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        complete: true,
        completeYear: done.getFullYear(),
        completeMonth: done.getMonth() + 1,
        completeDay: done.getDate()
      },
      { new: true }
    );

    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
