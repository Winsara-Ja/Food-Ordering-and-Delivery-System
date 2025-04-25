const MenuItem = require("../models/MenuItems");
const Restaurant = require("../models/Restaurant");

// Add menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    // Find the restaurant associated with the logged-in user
    const restaurantData = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurantData) return res.status(404).json({ message: "Restaurant not found" });

    // Now, the restaurant ID is automatically taken from the logged-in user's restaurant
    const menuItem = new MenuItem({
      restaurant: restaurantData._id,  // Use the found restaurant ID
      name,
      description,
      price,
      category,
      imageUrl
    });

    await menuItem.save();

    // Push menuItem to restaurant's menu array
    restaurantData.menu.push(menuItem.id);
    await restaurantData.save();

    res.status(201).json({
      message: "Menu item added and restaurant updated",
      menuItem,
      restaurantMenu: restaurantData.menu
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add item", error: err.message });
  }
};


// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate("restaurant");

    if (!menuItem) return res.status(404).json({ message: "Item not found" });

    if (menuItem.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, description, price, category, imageUrl, available } = req.body;

    if (name !== undefined) menuItem.name = name;
    if (description !== undefined) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    if (category !== undefined) menuItem.category = category;
    if (imageUrl !== undefined) menuItem.imageUrl = imageUrl;
    if (available !== undefined) menuItem.available = available;

    await menuItem.save();

    res.json({ message: "Menu item updated", menuItem });
  } catch (err) {
    res.status(500).json({ message: "Failed to update item", error: err.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate("restaurant");

    if (!menuItem) return res.status(404).json({ message: "Item not found" });

    if (menuItem.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove item from restaurant's menu array
    const restaurant = await Restaurant.findById(menuItem.restaurant._id);
    restaurant.menu = restaurant.menu.filter(itemId => itemId.toString() !== menuItem._id.toString());
    await restaurant.save();

    await menuItem.deleteOne();

    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
};

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().populate("restaurant", "name");
    res.json({ menuItems });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items", error: err.message });
  }
};

// Get a single menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate("restaurant", "name");

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ menuItem });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu item", error: err.message });
  }
};

// Get all menu items for the logged-in restaurant owner
exports.getAllMenus = async (req, res) => {
  try {
    // Find the restaurant linked to the logged-in user
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Fetch only the menu items that belong to that restaurant
    const menuItems = await MenuItem.find({ restaurant: restaurant._id });

    res.json({ menuItems });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items", error: err.message });
  }
};