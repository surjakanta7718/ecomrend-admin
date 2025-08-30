const express = require("express");
const router = express.Router({ mergeParams: true }); // important
const Review = require("../models/Review");
const authMiddleware = require("../middleware/auth");

// ➤ Add a review
router.post("/", authMiddleware, async (req, res) => {
   
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      product: req.params.productId, // comes from URL
      user: req.user.id,
      rating,
      comment
    });
    await review.save();
    res.json(review);
     console.log("rev sub saved");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ➤ Get all reviews for a product
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "email")
      .sort({ createdAt: -1 });

    const userId = req.user?.id;
    const reviewsWithOwnership = reviews.map(r => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      user: r.user,
      ownedByUser: userId === r.user._id.toString()
    }));

    res.json(reviewsWithOwnership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
