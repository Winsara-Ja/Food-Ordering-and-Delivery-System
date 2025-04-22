const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Add a new menu item
router.post("/", verifyToken, allowRoles("restaurant_owner"), menuController.addMenuItem);

// Update a menu item
router.put("/:id", verifyToken, allowRoles("restaurant_owner"), menuController.updateMenuItem);

// Delete a menu item
router.delete("/:id", verifyToken, allowRoles("restaurant_owner"), menuController.deleteMenuItem);

// Toggle availability
router.patch("/:id/availability", verifyToken, allowRoles("restaurant_owner"), menuController.toggleAvailability);

// Get all menu items (for both restaurant owners and customers)
router.get("/", verifyToken, allowRoles("restaurant_owner", "customer"), menuController.getAllMenuItems);

// Get a single menu item by ID (for both restaurant owners and customers)
router.get("/:id", verifyToken, allowRoles("restaurant_owner", "customer"), menuController.getMenuItemById);

module.exports = router;