const router = require('express').Router();
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');
const User = require('../models/User');

// Save a contact message (no user linking)
// router.post('/', async (req, res) => {
//   console.log("Contact POST Body:", req.body);
//   try {
//     const { name, email, message } = req.body;
//     if (!name || !email || !message) {
//       return res.status(400).json({ message: 'Missing fields' });
//     }

//     // Create and save contact
//     const contact = await new Contact({ name, email, message }).save();
//     console.log("Created Contact:", contact);

//    // res.json({ ok: true, id: contact._id });
//    res.json({ ok: true});
//   } catch (err) {
//     console.error("Error saving contact:", err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Add new contact and link it to logged-in user
router.post('/', auth, async (req, res) => {
  console.log("Contact POST Body:", req.body);
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // create new contact
    const contact = await new Contact({ name, email, message }).save();
console.log("Created Contact:", contact);
    // link this contact to the logged-in user
     await User.findByIdAndUpdate(req.user.id, {
       $push: { contacts: contact._id }
     });

    res.json({ ok: true, id: contact._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contacts of logged-in user
router.get('/',auth, async (req, res) => {
  console.log("Fetching contacts for user ID:", req.user.id);
  try {
    const user = await User.findById(req.user.id).populate('contacts');
    console.log("User contacts:", user.contacts);
   // res.json(user.contacts);
       res.json(user.contacts || []); // Always return an array

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;