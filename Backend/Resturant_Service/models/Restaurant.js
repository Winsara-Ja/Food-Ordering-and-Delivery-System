const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Restaurant admin
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  logoUrl: { type: String, default: "" },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }], // Link to menu items
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
