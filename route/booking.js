const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking');
const { authenticateToken, adminAuth } = require('../middleware/auth');


router.post('/create/:touristId/:packageId', authenticateToken, bookingController.createBooking);

module.exports = router;
