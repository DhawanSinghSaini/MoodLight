const mongoose = require("mongoose");

const SoundscapeTrackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model("SoundscapeTrack", SoundscapeTrackSchema);
