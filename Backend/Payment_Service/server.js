const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/payment", paymentRoutes);

//listen to request
app.listen(process.env.PORT, () => {
    console.log(`Payment service running on port ${process.env.PORT}`);
})
