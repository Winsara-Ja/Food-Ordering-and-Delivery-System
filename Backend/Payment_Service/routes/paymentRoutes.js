const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");
const {createPaymentIntent} = require("../controllers/paymentController");

router.post("/pay", processPayment);
router.post("/create-intent", createPaymentIntent);


module.exports = router;
