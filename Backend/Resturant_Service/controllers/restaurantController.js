const Restaurant = require("../models/Restaurant");

exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, phone, email, logoUrl } = req.body; // include logoUrl

    const newRestaurant = new Restaurant({
      name,
      address,
      phone,
      email,
      logoUrl, // add it to the model
      owner: req.user.id
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant created", restaurant: newRestaurant });
  } catch (err) {
    res.status(500).json({ message: "Error creating restaurant", error: err.message });
  }
};

// Get all restaurants (admin only)
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "name email");
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurants", error: err.message });
  }
};

// Get single restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("owner", "name email")
    .populate("menu");

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Optional: restrict access to owners (unless admin)
    if (req.user.role === "restaurant_owner" && restaurant.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", error: err.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, address, phone, email, status, logoUrl } = req.body; // include logoUrl

    restaurant.name = name || restaurant.name;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone || restaurant.phone;
    restaurant.email = email || restaurant.email;
    restaurant.status = status || restaurant.status;
    restaurant.logoUrl = logoUrl || restaurant.logoUrl; // update if provided

    await restaurant.save();
    res.json({ message: "Restaurant updated", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Error updating restaurant", error: err.message });
  }
};

// Delete restaurant (admin only)
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting restaurant", error: err.message });
  }
};

// Add in your router
exports.getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", error: err.message });
  }
};

// Get a single restaurant by its ID
exports.getRestaurantByResId = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id); // findById is more idiomatic here
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", error: err.message });
  }
};