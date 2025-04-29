const Driver = require('../models/Driver');
const Counter = require('../models/Counter');  // Import the counter model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Service function to register a new driver
const registerDriver = async (fullName, phoneNumber, email, password) => {
  try {
    // Get the next available driverID number
    const counter = await Counter.findOneAndUpdate(
      { _id: 'driverID' },
      { $inc: { sequence_value: 1 } },  // Increment the counter by 1
      { new: true, upsert: true }  // If the counter doesn't exist, create it
    );

    // Generate driverID in the format DRV-001, DRV-002, etc.
    const driverID = `DRV-${String(counter.sequence_value).padStart(3, '0')}`;

    // Check if the driver already exists by email
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      throw new Error('Driver with this email already exists');
    }

    // Create a new driver
    const driver = new Driver({
      driverID,
      fullName,
      phoneNumber,
      email,
      password
    });

    // Save the new driver to the database
    await driver.save();
    return driver;
  } catch (err) {
    throw new Error(err.message || 'Server error');
  }
};

// Service function to login a driver
const loginDriver = async (driverID, password) => {
    try {
      // Find the driver by driverID
      const driver = await Driver.findOne({ driverID });
      if (!driver) {
        throw new Error('Invalid credentials');
      }
  
      // Compare the password with the hashed password in the database
      const isMatch = await driver.matchPassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
  
      // Generate a JWT token with driverID in the payload (not _id)
      const token = jwt.sign({ driverID: driver.driverID }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
      return token;
    } catch (err) {
      throw new Error(err.message || 'Server error');
    }
  };
  
// Service method to update driver's status and location
const updateStatusAndLocation = async (driverID, status, coordinates) => {
    try {
      // Find the driver by their ID (driverId passed from the controller)
    const driver = await Driver.findOne({ driverID });  // Use driverID field
  
      if (!driver) {
        return null;
      }
  
      // Update the driver's status and location
      driver.status = status;
      driver.location.coordinates = coordinates;  // [longitude, latitude]
  
      // Save the updated driver details
      await driver.save();
      return driver;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating driver status and location');
    }
  };

module.exports = {
  registerDriver,
  loginDriver,
  updateStatusAndLocation
};
