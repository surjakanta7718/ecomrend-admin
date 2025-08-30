// controllers/adminAuth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Helper: Generate Token
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ Admin Register
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ username, email, password });
    await admin.save();

    res.json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
