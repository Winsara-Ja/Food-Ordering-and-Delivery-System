const mongoose = require('mongoose');
const axios = require('axios');
const Driver = require('../models/Driver');
const Delivery = require('../models/Delivery');

const GOOGLE_MAPS_API_KEY = 'AIzaSyA7DWiOccltzuMUOnvbZO4tAQArqsJCoOo';

// Function to get the closest available driver using Google Maps Distance Matrix API
const getClosestDriver = async (restaurantLocation) => {
  const { lat, lng } = restaurantLocation;

  try {
    // Step 1: Find active drivers' locations
    const drivers = await Driver.find({ status: 'active' }).select('driverID location assignedDeliveries');

    if (drivers.length === 0) {
      throw new Error('No available drivers found');
    }

    // Step 2: Get all active deliveries
    const activeDeliveries = await Delivery.find({ status: { $in: ['assigned', 'in-progress'] } }).select('driverId');

    // Step 3: Filter drivers who are available (i.e. not assigned to any active delivery)
    const availableDrivers = drivers.filter(driver => {
      // Ensure the driver has no active deliveries
      return driver.assignedDeliveries.every(deliveryId => {
        // Check if this driver has no active deliveries
        const isActiveDelivery = activeDeliveries.some(delivery => delivery.driverId.toString() === driver._id.toString());
        return !isActiveDelivery; // If the driver is not assigned to an active delivery, they are available
      });
    });

    if (availableDrivers.length === 0) {
      throw new Error('No available drivers with no active delivery');
    }

    // Step 4: Prepare API request for Distance Matrix
    const origins = [`${lat},${lng}`];  // restaurant's lat, long
    const destinations = availableDrivers.map(driver => `${driver.location.coordinates[1]},${driver.location.coordinates[0]}`);  // drivers' lat, long

    // Step 5: Make the request to Google Maps Distance Matrix API
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origins.join('|'),
        destinations: destinations.join('|'),
        key: GOOGLE_MAPS_API_KEY,
        units: 'metric', // Use 'imperial' for miles
      },
    });

    // Step 6: Find the closest driver
    const distances = response.data.rows[0].elements;
    let closestDriver = null;
    let minDistance = Infinity;

    distances.forEach((distance, index) => {
      if (distance.status === 'OK' && distance.distance.value < minDistance) {
        minDistance = distance.distance.value;
        closestDriver = availableDrivers[index];
      }
    });

    if (!closestDriver) {
      throw new Error('No drivers found within range');
    }

    return closestDriver;
  } catch (error) {
    throw new Error(error.message || 'Error in finding the closest driver');
  }
};
const createDelivery = async (restaurantId, orderDetails, closestDriver, restaurantLocation) => {
  try {
    // Step 1: Check if closestDriver is defined
    if (!closestDriver) {
      throw new Error('Driver not found');
    }

    // Step 2: Initialize assignedDeliveries if it's undefined or null
    if (!closestDriver.assignedDeliveries) {
      closestDriver.assignedDeliveries = [];  // Initialize as an empty array if not defined
    }

    // Step 3: Create a new delivery and assign the closest driver
    const newDelivery = new Delivery({
      restaurantId: restaurantId,  // Assuming restaurantId is already an ObjectId
      driverId: closestDriver.driverID,
      status: 'assigned',  // Initially, the status is 'assigned'
      location: { coordinates: [restaurantLocation.lng, restaurantLocation.lat] },
      orderDetails,
    });

    // Step 4: Save the new delivery
    await newDelivery.save();

    // Step 5: Add the new delivery to the driver's assigned deliveries
    closestDriver.assignedDeliveries.push(newDelivery._id);
    await closestDriver.save();  // Save the updated driver

    return newDelivery;
  } catch (error) {
    console.error('Error creating delivery:', error);
    throw new Error(error.message || 'Error creating the delivery');
  }
};

// Function to fetch a delivery by its ID
const getDeliveryById = async (deliveryId) => {
  try {
    const delivery = await Delivery.findById(deliveryId);
    return delivery;  // Return the found delivery
  } catch (error) {
    throw new Error('Error fetching the delivery: ' + error.message);
  }
};

module.exports = {
  getClosestDriver,
  createDelivery,
  getDeliveryById,
};
