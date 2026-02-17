const UserInfo = require("../models/UserInfo");

// Get user profile by loginId
exports.getUserProfile = async (req, res) => {
  try {
    const { loginId } = req.params;
    const user = await UserInfo.findOne({ loginId }).populate("loginId", "email");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { loginId } = req.params;
    const updates = req.body;

    const user = await UserInfo.findOneAndUpdate(
      { loginId },
      updates,
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
