const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.json(user.wishlist);
});

router.post('/toggle', auth, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);
  const exists = user.wishlist.some(id => id.toString() === productId);
  if (exists) user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  else user.wishlist.push(productId);
  await user.save();
  res.json(user.wishlist);
});

module.exports = router;
