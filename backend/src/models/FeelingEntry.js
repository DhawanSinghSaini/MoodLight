const mongoose = require("mongoose");

const FeelingEntrySchema = new mongoose.Schema({
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

  feeling: { type: String, required: true }, // e.g. "Happy"
  note:    { type: String } // user’s custom text
}, { timestamps: true });

module.exports = mongoose.model("FeelingEntry", FeelingEntrySchema);
