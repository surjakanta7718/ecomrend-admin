const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

dotenv.config();

const app = express();

// ✅ Enable CORS for all origins (adjust in production)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------- API ROUTES -----------------
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/cart", require("./routes/cart"));
app.use("/wishlist", require("./routes/wishlist"));
app.use("/orders", require("./routes/orders"));
app.use("/contact", require("./routes/contact"));
app.use("/products/:productId/reviews", require("./routes/review"));
app.use("/api/admin", require("./routes/admin"));

// ----------------- SERVE FRONTEND -----------------
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
const adminPath = path.join(__dirname, '..', 'admin');
app.use('/admin', express.static(adminPath));

// Catch-all route for frontend (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch(err => console.error('DB connect error', err));

// 👉 Export app (important for Vercel)
//module.exports = app;
// const express = require("express");
// const app = express();

// app.all("*", (req, res) => {
//   res.json({ message: "Hello from backend API 🚀", path: req.originalUrl });
// });


//module.exports = serverless(app);


// const express = require("express");
// const serverless = require("serverless-http");
// const connectDB = require("./db");

// const app = express();
// app.use(express.json());

// // Connect DB once (not per request)
// connectDB().then(() => console.log("✅ MongoDB connected")).catch(console.error);

// // Example route
// app.get("/api", (req, res) => res.json({ message: "Backend running ✅" }));

// // Your other routes
// app.use("/api/products", require("./routes/products"));
// // add more routes here

//  module.exports = app;
//  module.exports.handler = serverless(app);
