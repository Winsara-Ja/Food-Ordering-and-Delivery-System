const mongoose = require("mongoose");

const PaymentInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true }, // in LKR
  
  shippingAddress: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Sri Lanka" }, // always LK
  },

  phoneNumber: { type: String, required: true },

  paymentMethodId: { type: String },
  cardType: { type: String },      // visa, mastercard, etc.
  last4: { type: String },         // last 4 digits of card
  currency: { type: String, default: "LKR" }, // always rupees

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PaymentInfo", PaymentInfoSchema);
