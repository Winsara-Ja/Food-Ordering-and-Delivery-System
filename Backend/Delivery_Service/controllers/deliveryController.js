const deliveryService = require('../services/deliveryService');


// Controller to assign the closest driver and create a new delivery
const assignDriverToDelivery = async (req, res) => {
  const { restaurantLocation, orderDetails } = req.body;  // Extract restaurant location and order details
  const { restaurantId } = req.body;  // Assuming restaurantId is passed in the request

  try {
    // Step 1: Get the closest available driver
    const closestDriver = await deliveryService.getClosestDriver(restaurantLocation);

    // Step 2: Create the new delivery and assign the closest driver
    const newDelivery = await deliveryService.createDelivery(restaurantId, orderDetails, closestDriver, restaurantLocation);

    // Return success response
    return res.json({
      success: true,
      message: `Driver ${closestDriver.driverID} assigned to the delivery`,
      delivery: newDelivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error, please try again' });
  }
};
const mongoose = require('mongoose');
const Delivery = require('../models/Delivery'); // Assuming Delivery model is imported

// Function to get assigned deliveries for a driver
const getAssignedDeliveries = async (req, res) => {
  const driverId = req.driver;  // Get driverId from the authenticated user (assumed to be set via middleware)

  console.log(driverId);

  try {
    // Fetch deliveries where the driver is assigned
    const deliveries = await Delivery.find({ driverId: driverId, status: { $in: ['assigned', 'in-progress'] } });

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ success: false, message: 'No assigned deliveries found' });
    }

    // Return the deliveries
    return res.json({
      success: true,
      deliveries,
    });
  } catch (error) {
    console.error('Error fetching assigned deliveries:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// Update delivery status (Accept or Cancel)
const updateDeliveryStatus = async (req, res) => {
  const { deliveryId } = req.params;
  const { status } = req.body; // status should be either "in-progress" or "cancelled"

  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    delivery.status = status; // Update the status of the delivery
    await delivery.save();

    return res.json({
      success: true,
      message: `Delivery status updated to ${status}`,
      delivery,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error updating delivery status' });
  }
};

// Controller to fetch a delivery by its ID
const getDeliveryById = async (req, res) => {
  const { deliveryId } = req.params;  // Extract the deliveryId from the request parameters

  try {
    // Call the service to fetch the delivery by its ID
    const delivery = await deliveryService.getDeliveryById(deliveryId);

    if (!delivery) {
      // If no delivery is found, return a 404 error
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    // If the delivery is found, return it
    return res.json({ success: true, delivery });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    // If an error occurs, return a 500 error
    return res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

module.exports = {
  assignDriverToDelivery,
  getAssignedDeliveries,
  updateDeliveryStatus,
  getDeliveryById,
};
