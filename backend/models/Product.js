const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 100 },

    // Filtering fields
    category: { type: String, required: true }, // e.g. "Electronics", "Clothing"
    brand: { type: String }, // e.g. "Apple", "Nike"
    color: { type: String }, // optional
    size: { type: String },  // optional (for clothing)
    tags: [String] // for flexible searching
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
