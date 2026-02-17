const express = require("express");
const router = express.Router();
const DailyUserStats = require("../models/DailyUserStats");
const authMiddleware = require("../middleware/authMiddleware");

// ➡️ Get stats for a specific date
router.get("/:date", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const d = new Date(req.params.date);

    if (isNaN(d.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const stats = await DailyUserStats.findOne({
      userId,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    });

    res.json(stats || { feelings: [], health: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Update daily stats (unchanged)
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, feeling, health } = req.body;

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    let stats = await DailyUserStats.findOne({
      userId,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    });

    if (!stats) {
      stats = new DailyUserStats({
        userId,
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        feelings: [],
        health: []
      });
    }

    if (feeling) {
      const f = stats.feelings.find((f) => f.label === feeling);
      if (f) f.count += 1;
      else stats.feelings.push({ label: feeling, count: 1 });
    }

    if (health) {
      const h = stats.health.find((h) => h.label === health);
      if (h) h.count += 1;
      else stats.health.push({ label: health, count: 1 });
    }

    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Get last 7 daily stats (plain records only, consistent date handling)
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Just return the last 7 records, sorted by date/time
    const stats = await DailyUserStats.find({ userId })
      .sort({ year: -1, month: -1, day: -1, hour: -1, minute: -1 })
      .limit(7);

    res.json(stats);
  } catch (err) {
    console.error("Error in /recent:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Get the single most recent record (consistent date handling)
router.get("/last", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const lastRecord = await DailyUserStats.findOne({ userId })
      .sort({ year: -1, month: -1, day: -1, hour: -1, minute: -1 });

    res.json(lastRecord || { feelings: [], health: [] });
  } catch (err) {
    console.error("Error in /last:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
