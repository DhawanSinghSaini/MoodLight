const express = require("express");
const SoundscapeTrack = require("../models/SoundscapeTrack");
const SoundscapeUserListen = require("../models/SoundscapeUserListen");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Add a new track (admin or authenticated user)
 * Body: { title, artist, url }
 */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, artist, url } = req.body;
    const track = new SoundscapeTrack({ title, artist, url });
    await track.save();
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all tracks
 */
router.get("/tracks", authMiddleware, async (req, res) => {
  try {
    const tracks = await SoundscapeTrack.find();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Increment listen count for a user + track
 * URL: /api/soundscape/:trackId/listen
 * Body: none (userId comes from JWT)
 */
router.post("/:trackId/listen", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT payload
    const trackId = req.params.trackId;

    let userListen = await SoundscapeUserListen.findOne({ userId });

    if (!userListen) {
      userListen = new SoundscapeUserListen({
        userId,
        tracks: [{ trackId, count: 1 }]
      });
    } else {
      const trackEntry = userListen.tracks.find(
        t => t.trackId.toString() === trackId
      );
      if (trackEntry) {
        trackEntry.count += 1;
      } else {
        userListen.tracks.push({ trackId, count: 1 });
      }
    }

    await userListen.save();
    res.json(userListen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get listen counts for the authenticated user
 */
router.get("/user/listens", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const listens = await SoundscapeUserListen.findOne({ userId })
      .populate("tracks.trackId", "title artist url");
    res.json(listens || { userId, tracks: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
