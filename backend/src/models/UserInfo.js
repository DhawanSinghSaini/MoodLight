const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
  loginId: { type: mongoose.Schema.Types.ObjectId, ref: "LoginInfo", required: true },
  name: { type: String, required: true },
  age: { type: Number },
  sleepDuration: { type: Number },
  activityLevel: { type: String },
  overwhelmFrequency: { type: String },
  currentState: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserInfo", userInfoSchema);
