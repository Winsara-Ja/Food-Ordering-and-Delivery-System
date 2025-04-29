const express = require('express');
const { assignDriverToDelivery , getAssignedDeliveries , updateDeliveryStatus , getDeliveryById } = require('../controllers/deliveryController');
const authenticate = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// Route to assign the closest driver to a delivery
router.post('/assign-driver', assignDriverToDelivery);

// Route to get all assigned deliveries for the logged-in driver
router.get('/assigned', authenticate, getAssignedDeliveries);

router.patch('/:deliveryId/status' , updateDeliveryStatus);

router.get('/:deliveryId', getDeliveryById);



module.exports = router;
