const Order = require("../models/Order");

const OrderItem = async (req, res) => {
  try {
    const { cartItems, Total, userID, UserName, resID, resName } = req.body;
    const order = await Order.create({
      UserID: userID,
      RestaurantID: resID,
      RestaurantName: resName,
      UserName: UserName,
      ItemData: cartItems,
      TotalPrice: Total,
    });

    if (order) {
      // Return the order ID in the response
      return res.json({
        msg: "Order Successful",
        orderId: order._id, // <-- This is the key change!
      });
    }
    if (!order) {
      return res.status(500).json({
        error: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const getOrders = async (req, res) => {
  try {
    const userID = req.params.id;
    const orderItems = await Order.find({ UserID: userID });
    res.json(orderItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orderItems = await Order.find({});
    res.json(orderItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const ChangeStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;
    await Order.findByIdAndUpdate({ _id }, { PaymetStatus: status });
  } catch (error) {
    console.log(error);
  }
};

const mongoose = require('mongoose');

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const order = await Order.findById(orderId); // cleaner
    //console.log("Order found:", order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  OrderItem,
  getOrders,
  ChangeStatus,
  getAllOrders,
  getOrderById,
};