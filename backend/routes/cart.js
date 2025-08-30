const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// get cart
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product');
  res.json(user.cart);
});

// add item
router.post('/add', auth, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const user = await User.findById(req.user.id);
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const found = user.cart.find(i => i.product?.toString() === productId);
  if (found) found.qty += qty;
  else user.cart.push({ product: productId, qty });
  await user.save();
  res.json(user.cart);
});

// update qty
router.put('/update', auth, async (req, res) => {
  const { productId, qty } = req.body;
  const user = await User.findById(req.user.id);
  const item = user.cart.find(i => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Not in cart' });
  item.qty = Math.max(1, Number(qty));
  await user.save();
  res.json(user.cart);
});

// remove
router.delete('/remove', auth, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter(i => i.product.toString() !== productId);
  await user.save();
  res.json(user.cart);
});

module.exports = router;
