const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");

// GET /products?category=&brand=&color=&size=&minPrice=&maxPrice=
router.get("/", async (req, res) => {
  try {
    const { category, brand, color, size, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) filter.category = category.trim();
    if (brand) filter.brand = brand.trim();
    if (color) filter.color = color.trim();
    if (size) filter.size = size.trim();

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// GET /products/:id - single product with reviews & average rating
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Not found" });

    const reviews = await Review.find({ product: product._id })
      .populate("user", "email")
      .sort({ createdAt: -1 })
      .lean();

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      ...product,
      avgRating: Number(avgRating.toFixed(2)),
      reviewCount: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

module.exports = router;
