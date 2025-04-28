const express = require('express');
const router = express.Router();
const requestDashboardController = require('../controllers/requestDashboardController');

router.post('/', requestDashboardController.requestDashboardAccess); // Create request
router.get('/count', requestDashboardController.getPendingDashboardAccessRequests); // Get all requests
router.get('/', requestDashboardController.getAllDashboardRequests); // Get all requests    
router.put('/:id', requestDashboardController.updateRequestStatus); // Approve/Reject request

module.exports = router;