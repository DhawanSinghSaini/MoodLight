const LoginInfo = require("../models/LoginInfo");
const UserInfo = require("../models/UserInfo");
const { hashPassword, comparePassword } = require("../utils/hash");
const jwt = require("jsonwebtoken");

// ✅ Signup Controller
exports.signup = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      age,
      sleepDuration,
      activityLevel,
      overwhelmFrequency,
      currentState,
    } = req.body;

    // Check if email already exists
    const existingUser = await LoginInfo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Save login info
    const hashedPassword = await hashPassword(password);
    const login = new LoginInfo({ email, password: hashedPassword });
    await login.save();

    // Save user info linked to loginId
    const user = new UserInfo({
      loginId: login._id,
      name,
      age,
      sleepDuration,
      activityLevel,
      overwhelmFrequency,
      currentState,
    });
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", loginId: login._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await LoginInfo.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Check Email Controller
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await LoginInfo.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
