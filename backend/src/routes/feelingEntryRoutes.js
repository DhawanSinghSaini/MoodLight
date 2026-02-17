const express = require("express");
const router = express.Router();
const FeelingEntry = require("../models/FeelingEntry");
const DailyUserStats = require("../models/DailyUserStats");
const authMiddleware = require("../middleware/authMiddleware");

// ➡️ Add a new feeling entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { feeling, note, health } = req.body;

    // Current time components
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JS months are 0–11
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Save individual feeling entry
    const entry = new FeelingEntry({
      userId,
      feeling,
      note,
      year,
      month,
      day,
      hour,
      minute,
    });

    await entry.save();

    // Find today's stats using year, month, day
    let stats = await DailyUserStats.findOne({ userId, year, month, day });

    if (!stats) {
      stats = new DailyUserStats({
        userId,
        year,
        month,
        day,
        hour,
        minute,
        feelings: [],
        health: [],
      });
    }

    // Update feelings count
    const f = stats.feelings.find((f) => f.label === feeling);
    if (f) f.count += 1;
    else stats.feelings.push({ label: feeling, count: 1 });

    // Update health count
    if (health) {
      const h = stats.health.find((h) => h.label === health);
      if (h) h.count += 1;
      else stats.health.push({ label: health, count: 1 });
    }

    await stats.save();

    res.json({ entry, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Get last 7 feeling entries for a user
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await FeelingEntry.find({ userId })
      .sort({ year: -1, month: -1, day: -1, hour: -1, minute: -1 })
      .limit(7);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
