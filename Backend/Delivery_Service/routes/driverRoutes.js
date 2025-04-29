const express = require('express');
const { registerDriver, loginDriver , updateDriverStatus } = require('../controllers/driverController');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');  


// Register a driver (public route)
router.post('/register', registerDriver);

// Login driver (public route)
router.post('/login', loginDriver);

router.post('/update-status', authenticate, updateDriverStatus);


module.exports = router;
