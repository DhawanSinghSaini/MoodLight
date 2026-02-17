const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Activity", ActivitySchema);
