const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking');
const { authenticateToken, vendorAuth, clientAuth } = require('../middleware/auth');


router.post('/create/:touristId/:packageId', authenticateToken, bookingController.createBooking);

router.get('/get-all/:touristId', authenticateToken, vendorAuth, bookingController.getAllBooking)

router.get('/get-all', authenticateToken, clientAuth, bookingController.getAll)

module.exports = router;
