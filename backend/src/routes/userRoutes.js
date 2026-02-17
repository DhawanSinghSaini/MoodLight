const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/userController");

// Get user profile
router.get("/:loginId", getUserProfile);

// Update user profile
router.put("/:loginId", updateUserProfile);

module.exports = router;
