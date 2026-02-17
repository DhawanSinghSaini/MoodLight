const mongoose = require("mongoose");

const SoundscapeUserListenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "LoginInfos", required: true },
  tracks: [
    {
      trackId: { type: mongoose.Schema.Types.ObjectId, ref: "SoundscapeTrack", required: true },
      count: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model("SoundscapeUserListen", SoundscapeUserListenSchema);
