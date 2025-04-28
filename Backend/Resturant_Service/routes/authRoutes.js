const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const {getUserByUserId} = require("../controllers/userManagementController")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/user/:id", getUserByUserId); // New route to get user by ID

module.exports = router;