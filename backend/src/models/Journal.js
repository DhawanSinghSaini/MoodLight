const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // Split date into separate fields
  year:   { type: Number, required: true },
  month:  { type: Number, required: true }, // 1–12
  day:    { type: Number, required: true }, // 1–31
  hour:   { type: Number, required: true }, // 0–23
  minute: { type: Number, required: true }, // 0–59

  heading: { type: String, default: "Journal Entry" },
  journal: { type: String, required: true },

  // Feelings list (no counts, just labels)
  feelings: [
    { label: { type: String, required: true } } // e.g. "Happy"
  ],

  // Mental health list (no counts, just labels)
  mentalHealth: [
    { label: { type: String, required: true } } // e.g. "Anxiety"
  ]
}, { timestamps: true });

module.exports = mongoose.model("Journal", JournalSchema);
