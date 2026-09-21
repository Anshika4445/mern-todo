const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  if (!/^\S+@\S+\.\S+$/.test(email))
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid email" });
  if (password.length < 6)
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  if (await User.exists({ email: email.toLowerCase() }))
    return res
      .status(409)
      .json({ success: false, message: "Email is already registered" });
  const user = await User.create({ name, email, password });
  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user || !(await user.comparePassword(password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  res.json({
    success: true,
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};
exports.me = async (req, res) => res.json({ success: true, user: req.user });
