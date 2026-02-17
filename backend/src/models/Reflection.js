const mongoose = require("mongoose");

const ReflectionSchema = new mongoose.Schema({
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

  text: { type: String, required: true },

  // Feelings list (top 3 labels)
  feelings: [
    { label: { type: String, required: true } }
  ],

  // Mental health list (top 1 label)
  mentalHealth: [
    { label: { type: String, required: true } }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Reflection", ReflectionSchema);
