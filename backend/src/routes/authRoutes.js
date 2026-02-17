const express = require("express");
const router = express.Router();
const { signup, login, checkEmail } = require("../controllers/authController");

// ✅ Signup route
router.post("/signup", signup);

// ✅ Check if email exists route
router.post("/check-email", checkEmail);

// ✅ Login route
router.post("/login", login);

module.exports = router;
