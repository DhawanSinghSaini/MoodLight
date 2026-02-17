const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  emoji: { type: String, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },

  // Split due date into separate fields
  dueYear:   { type: Number, required: true },
  dueMonth:  { type: Number, required: true }, // 1–12
  dueDay:    { type: Number, required: true }, // 1–31

  // Split completion date into separate fields (optional)
  completeYear:   { type: Number },
  completeMonth:  { type: Number },
  completeDay:    { type: Number },

  complete: { type: Boolean, default: false } // ✅ track completion
}, { timestamps: true });

module.exports = mongoose.model("Goal", GoalSchema);
