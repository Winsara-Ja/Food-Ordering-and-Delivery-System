const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  UserID: String,
  RestaurantID: String,
  RestaurantName: String,
  ItemID: String,
  ItemName: String,
  Description: String,
  Image: String,
  Quantity: Number,
  ItemPrice: Number,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
