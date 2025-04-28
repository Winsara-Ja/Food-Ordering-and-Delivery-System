const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  OrderItem,
  getOrders,
  ChangeStatus,
  getAllOrders,
  getOrderById,
} = require("../controllers/orderController");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/order", OrderItem);
router.get("/orderItems/:id", getOrders);
router.get("/orderItems", getAllOrders);
router.put("/order/status", ChangeStatus);
router.get("/orders/:orderId", getOrderById); // New route to get order by ID

module.exports = router;
