const Stripe = require("stripe");
const axios = require("axios");
const PaymentInfo = require("../models/paymentInfo.model");
const mongoose = require('mongoose');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
  const {
    orderId,
    userId,
    address,
    phoneNumber,
    cardDetails
  } = req.body;

  const {
    houseNumber,
    street,
    city,
    district,
    province,
    postalCode
  } = address;

  const {
    paymentMethodId,  // ✅ changed from cardNumber
    cardHolderName
  } = cardDetails;



  // 2. Validate other required fields
  if (!orderId || !userId || !phoneNumber || !cardHolderName || !paymentMethodId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  

  /*
  // 3. Fetch amount from order-service
  let amountInCents;
  try {
    const orderResponse = await axios.get(`http://localhost:5000/orderItems/${orderId}`);
    const orderData = orderResponse.data;

    if (!orderData || !orderData.TotalPrice) {
      return res.status(400).json({ error: "Invalid order data from order-service" });
    }

    // Convert LKR to cents (Stripe format)
    amountInCents = Math.round(orderData.TotalPrice * 100);
  } catch (error) {
    console.error("Order Service Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch order details" });
  }
    */

  try {

    // ✅ Retrieve the payment method details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    const cardType = paymentMethod.card.brand; // e.g., visa, mastercard
    const last4 = paymentMethod.card.last4;


    // 6. Save to DB (without amount)
    const paymentRecord = new PaymentInfo({
      userId,  
      orderId,
      shippingAddress: {
        houseNumber,
        street,
        city,
        district,
        province,
        postalCode,
        country: "Sri Lanka",
      },
      phoneNumber,
      paymentMethodId,
      cardType,
      last4
    });

    await paymentRecord.save();

    res.status(200).json({
      message: "Payment successful",
      paymentMethodId,
      
      cardType,
      last4
    });

  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: "Payment failed", details: err.message });
  }
};


exports.createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  let amountInCents;
  try {
    const orderResponse = await axios.get(`http://localhost:5001/orders/${orderId}`);
    console.log("Order data from order-service:", orderResponse.data);
    const orderData = orderResponse.data;

    if (!orderData || !orderData.TotalPrice) {
      return res.status(400).json({ error: "Invalid order data from order-service" });
    }

    amountInCents = Math.round(orderData.TotalPrice * 100);
  } catch (error) {
    console.error("Order Service Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch order details" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "lkr",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};


