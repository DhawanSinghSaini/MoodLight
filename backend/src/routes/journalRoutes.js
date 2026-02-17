const express = require("express");
const router = express.Router();
const axios = require("axios");
const Journal = require("../models/Journal");
const DailyUserStats = require("../models/DailyUserStats");
const authMiddleware = require("../middleware/authMiddleware");

const EMOTION_API_URL = process.env.EMOTION_API_URL;
const MENTAL_API_URL = process.env.MENTAL_API_URL;

// ➡️ Get all journal entries (newest → oldest)
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Journal.find({ userId })
      .sort({ year: -1, month: -1, day: -1, hour: -1, minute: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ Add a new journal entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { journal, heading } = req.body;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Split journal text into sentences/segments
    const segments = journal.split(/[.!?]/).map(s => s.trim()).filter(Boolean);

    // Call external APIs for batch prediction
    const [emotionRes, mentalRes] = await Promise.all([
      axios.post(`${EMOTION_API_URL}/predict_batch`, { texts: segments }),
      axios.post(`${MENTAL_API_URL}/predict_batch`, { texts: segments })
    ]);

    // Parse emotion predictions (array of strings)
    const feelingsRaw = emotionRes.data?.predictions || [];

    // Count frequency of feelings
    const feelingCounts = {};
    feelingsRaw.forEach(f => {
      feelingCounts[f] = (feelingCounts[f] || 0) + 1;
    });

    // Sort and keep top 3 feelings
    const topFeelings = Object.entries(feelingCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label]) => ({ label }));

    // Parse mental health predictions (array of {confidence, label})
    const mentalRaw = mentalRes.data?.predictions || [];

    // Count frequency of mental health labels
    const mentalCounts = {};
    mentalRaw.forEach(m => {
      const label = m.label;
      mentalCounts[label] = (mentalCounts[label] || 0) + 1;
    });

    // Sort and keep top 1 mental health
    const topMental = Object.entries(mentalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1)
      .map(([label]) => ({ label }));

    // Save journal entry
    const entry = new Journal({
      userId,
      year,
      month,
      day,
      hour,
      minute,
      heading: heading || "Journal Entry",
      journal,
      feelings: topFeelings,
      mentalHealth: topMental
    });

    await entry.save();

    // Update DailyUserStats for that day
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
        health: []
      });
    }

    // Update feelings counts
    topFeelings.forEach(({ label }) => {
      const f = stats.feelings.find(f => f.label === label);
      if (f) f.count += 1;
      else stats.feelings.push({ label, count: 1 });
    });

    // Update mental health counts
    topMental.forEach(({ label }) => {
      const h = stats.health.find(h => h.label === label);
      if (h) h.count += 1;
      else stats.health.push({ label, count: 1 });
    });

    await stats.save();

    res.json({ entry, stats });
  } catch (err) {
    console.error("Journal save error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
