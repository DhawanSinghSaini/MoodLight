const express = require("express");
const TimerAudio = require("../models/timerAudio");

const router = express.Router();

// Add a new audio link
router.post("/add", async (req, res) => {
  try {
    const { name, url } = req.body;
    const audio = new TimerAudio({ name, url });
    await audio.save();
    res.json(audio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all audio links
router.get("/", async (req, res) => {
  try {
    const audios = await TimerAudio.find();
    res.json(audios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one audio link by name
router.get("/:name", async (req, res) => {
  try {
    const audio = await TimerAudio.findOne({ name: req.params.name });
    if (!audio) return res.status(404).json({ error: "Not found" });
    res.json(audio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
