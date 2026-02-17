const mongoose = require("mongoose");

const loginInfoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoginInfo", loginInfoSchema);
