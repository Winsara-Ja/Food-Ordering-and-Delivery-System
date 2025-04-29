const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver'); // Import the Driver model

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization required' });
    }
  
    try {
      // Decode the token and get the driver's driverID from the token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Log the decoded token for debugging purposes
      console.log('Decoded Token:', decoded);
  
      // Find the driver in the database using the decoded driverID
      const driver = await Driver.findOne({ driverID: decoded.driverID });
  
      // Log the result of the driver lookup
      console.log('Driver Found:', driver);
  
      if (!driver) {
        return res.status(404).json({ success: false, message: 'Driver not found' });
      }
  
      // Attach the driver ID to the request object for use in the controller
      req.driver = driver.driverID;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Token is not valid' });
    }
  };
  

module.exports = authenticate;
