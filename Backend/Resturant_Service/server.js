const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); 
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const userManagementRoutes = require("./routes/userManagementRoutes");
const requestDashboardRoutes = require("./routes/requestDashboardRoutes");
const documentRoutes = require("./routes/documentRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded docs statically (so frontend can access them)
app.use("/uploads/documents", express.static(path.join(__dirname, "uploads/documents")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/user-management", userManagementRoutes);
app.use("/api/dashboard-requests", requestDashboardRoutes);
app.use("/api/documents", documentRoutes);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

