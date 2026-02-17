const express = require("express");
const router = express.Router();
const UserStreak = require("../models/UserStreak");
const authMiddleware = require("../middleware/authMiddleware");

// Update streak when user visits/acts
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let streak = await UserStreak.findOne({ userId });

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth() + 1;
    const todayDay = now.getDate();

    if (!streak) {
      // First streak entry
      streak = new UserStreak({
        userId,
        currStreak: 1,
        maxStreak: 1,
        lastYear: todayYear,
        lastMonth: todayMonth,
        lastDay: todayDay,
        lastHour: now.getHours(),
        lastMinute: now.getMinutes()
      });
    } else {
      const { lastYear, lastMonth, lastDay } = streak;

      if (lastYear === todayYear && lastMonth === todayMonth && lastDay === todayDay) {
        // ✅ Same day → do nothing
      } else {
        // ✅ Different day → increment streak
        streak.currStreak += 1;
        if (streak.currStreak > streak.maxStreak) {
          streak.maxStreak = streak.currStreak;
        }
        streak.lastYear = todayYear;
        streak.lastMonth = todayMonth;
        streak.lastDay = todayDay;
        streak.lastHour = now.getHours();
        streak.lastMinute = now.getMinutes();
      }
    }

    await streak.save();
    res.json(streak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current streak info
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await UserStreak.findOne({ userId });
    res.json(
      streak || { currStreak: 0, maxStreak: 0, lastYear: null, lastMonth: null, lastDay: null, lastHour: null, lastMinute: null }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
