const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant"); 

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role set to 'customer'
    user = new User({ username, email, password: hashedPassword, role: "customer" });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Check if restaurant is registered (only for restaurant_owner)
    let isRestaurantRegistered = true;
    if (user.role === "restaurant_owner") {
      const restaurant = await Restaurant.findOne({ owner: user._id }); // assuming `owner` is the reference
      isRestaurantRegistered = !!restaurant;
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, role: user.role, isRestaurantRegistered });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};