const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
console.log("Auth Middleware - Authorization Header:", header);
  if (!header) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Malformed authorization header" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains { id, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
