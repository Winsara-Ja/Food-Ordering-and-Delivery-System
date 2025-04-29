const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Create a restaurant (restaurant_owner only)
router.post("/", verifyToken, allowRoles("restaurant_owner"), restaurantController.createRestaurant);

router.get("/my-restaurant", verifyToken, allowRoles("restaurant_owner"), restaurantController.getMyRestaurant);

// Get all restaurants (admin only)
router.get("/", verifyToken, allowRoles("admin", "restaurant_owner", "customer"), restaurantController.getAllRestaurants);

// Get single restaurant by ID (restaurant_owner or admin)
router.get("/:id", verifyToken, allowRoles("admin", "restaurant_owner", "customer"), restaurantController.getRestaurantById);

// Update a restaurant (restaurant_owner only)
router.put("/:id", verifyToken, allowRoles("restaurant_owner"), restaurantController.updateRestaurant);

// Delete a restaurant (admin only)
router.delete("/:id", verifyToken, allowRoles("admin"), restaurantController.deleteRestaurant);

router.get("/res/:id",restaurantController.getRestaurantByResId)

module.exports = router;
