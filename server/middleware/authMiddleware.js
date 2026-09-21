const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer "))
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
module.exports = protect;
