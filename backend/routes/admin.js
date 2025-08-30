// backend/routes/admin.js
const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const { registerAdmin, loginAdmin } = require("../controllers/adminAuth");
const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// ✅ Auth Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ✅ User Management
router.get("/users", protectAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.delete("/users/:id", protectAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User removed" });
});

// ✅ Product Management
router.post("/products", protectAdmin, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

router.get("/products", protectAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/products/:id", protectAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

router.put("/products/:id", protectAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/products/:id", protectAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

// admin route
router.get("/users/:userId/contacts", protectAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("contacts");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
