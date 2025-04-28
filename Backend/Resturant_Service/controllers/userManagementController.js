const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { role } = req.body; // Only allow role to be updated

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Do NOT update username or email
    if (role) user.role = role;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

// Controller for getting user count 
exports.getAdminOverview = async (req, res) => {
  try {
    // Count users by role
    const activeUsersCustomer = await User.countDocuments({ role: "customer" });
    const activeUsersRestaurantOwner = await User.countDocuments({ role: "restaurant_owner" });
    const activeUsersAdmin = await User.countDocuments({ role: "admin" });

    // Return the data to the client
    return res.status(200).json({
      activeUsersCustomer,
      activeUsersRestaurantOwner,
      activeUsersAdmin
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Get a single user by ID
exports.getUserByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId); // No .select() call
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};
