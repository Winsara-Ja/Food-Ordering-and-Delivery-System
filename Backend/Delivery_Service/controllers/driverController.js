const driverService = require('../services/driverService');

// Register a new driver
const registerDriver = async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;

  try {
    const driver = await driverService.registerDriver(fullName, phoneNumber, email, password);
    res.status(201).json({
      success: true,
      message: 'Driver registered successfully',
      driverID: driver.driverID  // Return the generated driverID
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Controller method to login a driver
const loginDriver = async (req, res) => {
    const { driverID, password } = req.body;  // Expecting driverID and password from the body
  
    try {
      // Call the service to login and get the token
      const token = await driverService.loginDriver(driverID, password);
  
      // Send the token back in the response
      res.json({
        success: true,
        token
      });
    } catch (err) {
      // If an error occurs, return a failure message
      res.status(400).json({ success: false, message: err.message });
    }
  };

// Controller method to handle updating driver's status and location
const updateDriverStatus = async (req, res) => {
    const { status, coordinates } = req.body;  // Expecting status (active/inactive) and coordinates (lat, long)
  
    try {
      // Call the service to update the driver's status and location

      console.log("yoo",req.driver);
      const updatedDriver = await driverService.updateStatusAndLocation(req.driver, status, coordinates);
  
      if (!updatedDriver) {
        return res.status(404).json({ success: false, message: 'Driver not found' });
      }
  
      return res.json({
        success: true,
        message: `Driver status updated to ${status}`,
        status: updatedDriver.status,
        location: updatedDriver.location.coordinates,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error, please try again' });
    }
  };

module.exports = {
  registerDriver,
  loginDriver,
  updateDriverStatus
};
