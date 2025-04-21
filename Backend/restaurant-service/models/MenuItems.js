const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Beverages", "Main Course"
  imageUrl: { type: String }, // Image URL for the menu item
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);