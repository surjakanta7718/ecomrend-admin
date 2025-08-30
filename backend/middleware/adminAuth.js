// middleware/adminAuth.js
const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protectAdmin;
