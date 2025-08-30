const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: { type: Number, default: 1 }
    }
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }], // 👈 new field
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
