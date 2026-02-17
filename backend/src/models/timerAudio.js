const mongoose = require("mongoose");

const TimerAudioSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. "Birds"
  url: { type: String, required: true }     // GitHub raw link
});

module.exports = mongoose.model("TimerAudio", TimerAudioSchema);
