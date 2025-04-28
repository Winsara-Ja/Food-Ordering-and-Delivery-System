const express = require("express");
const router = express.Router();
const { sendOrderConfirmation } = require("../controllers/notificationController");


router.post("/email-user", sendOrderConfirmation);


module.exports = router;
