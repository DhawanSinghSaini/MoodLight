const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// ➡️ POST: Add a new activity
router.post("/", async (req, res) => {
  try {
    const { emoji, heading, description } = req.body;
    const activity = new Activity({ emoji, heading, description });
    await activity.save();
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ GET: Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➡️ GET: Suggest a random activity
router.get("/suggest", async (req, res) => {
  try {
    const activities = await Activity.find();
    if (activities.length === 0) {
      return res.json({ message: "No activities available" });
    }
    const randomIndex = Math.floor(Math.random() * activities.length);
    res.json(activities[randomIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
