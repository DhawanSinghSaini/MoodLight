const mongoose = require("mongoose");

const StreakSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "LoginInfos", 
    required: true 
  },

  currStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },

  // Split last streak date into components
  lastYear:   { type: Number },
  lastMonth:  { type: Number }, // 1–12
  lastDay:    { type: Number }, // 1–31
  lastHour:   { type: Number }, // 0–23
  lastMinute: { type: Number }  // 0–59
});

module.exports = mongoose.model("UserStreak", StreakSchema);
