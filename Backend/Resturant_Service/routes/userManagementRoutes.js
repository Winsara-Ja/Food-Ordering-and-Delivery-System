const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");
const adminUserController = require("../controllers/userManagementController");

router.get('/:id/location', adminUserController.getCustomerLocation);

// Protect all admin user routes
router.use(verifyToken, allowRoles("admin"));

router.get("/", adminUserController.getAllUsers);
router.get("/:id", adminUserController.getUserById);
router.put("/:id", adminUserController.updateUser);
router.delete("/:id", adminUserController.deleteUser);


module.exports = router;
