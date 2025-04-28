const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/notify", notificationRoutes);

// Listen to requests
app.listen(process.env.PORT, () => {
    console.log(`Notification service running on port ${process.env.PORT}`);
});
