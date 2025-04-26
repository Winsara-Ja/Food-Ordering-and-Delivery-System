const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require("cors");

const CartRoute = require("./routes/cartRoute");
const OrderRoute = require("./routes/orderRoute");

const app = express();

app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses JSON request body
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to the Database");
  } catch (err) {
    console.log(err);
  }
};

connectDB();

app.use("/", CartRoute);
app.use("/", OrderRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));