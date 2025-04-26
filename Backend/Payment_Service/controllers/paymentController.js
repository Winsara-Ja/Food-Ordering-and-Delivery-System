const Stripe = require("stripe");
const axios = require("axios");
const PaymentInfo = require("../models/paymentInfo.model");

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


  /* 1. Validate card number
  const numberValidation = cardValidator.number(cardNumber); 
  if (!numberValidation.isValid) {
    return res.status(400).json({ error: "Invalid card number" });
  }

  const cardType = numberValidation.card.type;
  const last4 = cardNumber.slice(-4);

  */

  // 2. Validate other required fields
  if (!orderId || !userId || !phoneNumber || !cardHolderName || !paymentMethodId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  

  /*
  // 3. Fetch amount from order-service
  let amountInCents;
  try {
    const orderResponse = await axios.get(`http://order-service/api/orders/${orderId}`);
    const orderData = orderResponse.data;

    if (!orderData || !orderData.totalPrice) {
      return res.status(400).json({ error: "Invalid order data from order-service" });
    }

    // Convert LKR to cents (Stripe format)
    amountInCents = Math.round(orderData.totalPrice * 100);
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
      //orderId,
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
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 17000, // LKR 170.00 (Stripe expects smallest currency unit)
      currency: "lkr",
      automatic_payment_methods: { enabled: true }, // Optional but recommended
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};


