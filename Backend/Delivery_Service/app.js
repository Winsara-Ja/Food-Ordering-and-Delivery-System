const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const driverRoutes = require('./routes/driverRoutes');  // Import driver routes
const deliveryRoutes = require('./routes/deliveryRoutes');  // Import delivery routes
const Driver = require('./models/Driver'); // Import the Driver model (make sure it's correctly defined in your models folder)

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server to use with Socket.io
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow frontend to connect
    methods: ['GET', 'POST'],
  },
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS (Allow all origins for testing)
app.use(cors());  // You can later restrict this to specific origins for production

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  
    // Handle joining a delivery room
    socket.on('joinDelivery', (deliveryId) => {
      socket.join(deliveryId);
      console.log(`Socket ${socket.id} joined delivery room: ${deliveryId}`);
    });
  
    // Handle driver location updates
    socket.on('updateDriverLocation', async (deliveryId, driverLocation) => {
      try {
        // Validate driverLocation
        if (!driverLocation.driverId || !driverLocation.lat || !driverLocation.lng) {
          console.log('Invalid driver location data:', driverLocation);
          return;
        }
  
        // Find and update the driver's location in the database
        const driver = await Driver.findOne({ driverID: driverLocation.driverId });
        if (!driver) {
          console.log('Driver not found:', driverLocation.driverId);
          return;
        }
  
        // Update driver's location in the database
        driver.location.coordinates = [driverLocation.lng, driverLocation.lat];
        await driver.save();
  
        // Emit the updated location to the delivery room
        io.to(deliveryId).emit('driverLocationUpdated', {
          lat: driver.location.coordinates[1], // Latitude
          lng: driver.location.coordinates[0], // Longitude
          driverId: driverLocation.driverId,
          status: driverLocation.status || undefined, // Include status if provided
        });
  
        console.log(`Driver location updated for delivery ${deliveryId}:`, {
          lat: driver.location.coordinates[1],
          lng: driver.location.coordinates[0],
        });
      } catch (error) {
        console.error('Error updating driver location:', error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

// Mock data for restaurant and customer
const mockRestaurant = {
  id: 'restaurant123',
  location: { lat: 6.9271, lng: 79.8612 } // Example coordinates
};

const mockCustomer = {
  id: 'customer123',
  location: { lat: 6.9275, lng: 79.8608 } // Example coordinates
};

// Mock API for restaurant location
app.get('/api/restaurant/:id', (req, res) => {
  // Assuming the `id` passed in the URL is the restaurant ID
  const restaurantId = req.params.id;
  console.log('Received restaurant ID:', restaurantId);


  // Return mock data for restaurant
  if (restaurantId === mockRestaurant.id || restaurantId === 'restaurant12345') {
    return res.json(mockRestaurant.location);
  }

  return res.status(404).json({ message: 'Restaurant not found' });
});

// Mock API for customer location
app.get('/api/customer/:id', (req, res) => {
  // Assuming the `id` passed in the URL is the customer ID
  const customerId = req.params.id;

  // Return mock data for customer
  if (customerId === mockCustomer.id) {
    return res.json(mockCustomer.location);
  }

  return res.status(404).json({ message: 'Customer not found' });
});


// Routes
app.use('/api/drivers', driverRoutes);  // Driver-related routes
app.use('/api/deliveries', deliveryRoutes);  // Delivery-related routes

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
