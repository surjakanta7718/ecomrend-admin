const router = require('express').Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

router.post('/create', auth, async (req, res) => {
  const { address } = req.body;
  const user = await User.findById(req.user.id).populate('cart.product');
  if (!user.cart.length) return res.status(400).json({ message: 'Cart is empty' });
  const items = user.cart.map(i => ({ product: i.product._id, title: i.product.title, qty: i.qty, price: i.product.price }));
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const order = await new Order({ user: req.user.id, items, total, address }).save();
  user.cart = []; await user.save();
  res.json(order);
});

router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
