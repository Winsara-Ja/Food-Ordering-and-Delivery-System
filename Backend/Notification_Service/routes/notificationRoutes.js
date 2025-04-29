const express = require("express");
const router = express.Router();
const { sendOrderConfirmation, sendOrderConfirmationToDriver } = require("../controllers/notificationController");


router.post("/email-user", sendOrderConfirmation);
router.post("/email-driver", sendOrderConfirmationToDriver); 


module.exports = router;
