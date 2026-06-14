const router = require('express').Router()
const paymentController = require('../controller/payment')
const { authenticateToken } = require('../middleware/auth')

router.post('/make-payment/:bookingId', authenticateToken, paymentController.initiatePayment )

router.get('/verify-payment', authenticateToken, paymentController.verifyPayment)

router.post('/verify-webhook',  paymentController.verifyWebhook)

module.exports = router