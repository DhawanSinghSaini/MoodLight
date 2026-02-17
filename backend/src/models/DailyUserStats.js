const mongoose = require("mongoose");

const DailyUserStatsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "LoginInfos", 
    required: true 
  },

  // Split date into separate fields
  year:   { type: Number, required: true },
  month:  { type: Number, required: true }, // 1–12
  day:    { type: Number, required: true }, // 1–31
  hour:   { type: Number, required: true }, // 0–23
  minute: { type: Number, required: true }, // 0–59

  // Feelings list with counts
  feelings: [
    {
      label: { type: String, required: true }, // e.g. "Happy"
      count: { type: Number, default: 0 }
    }
  ],

  // Health list with counts
  health: [
    {
      label: { type: String, required: true }, // e.g. "Depression"
      count: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("DailyUserStats", DailyUserStatsSchema);
