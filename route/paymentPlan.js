const router = require('express').Router()
const paymentPlanController = require('../controller/paymentPlan')
const {authenticateToken, vendorAuth} = require('../middleware/auth')

router.post('/create-plan/:packageId', authenticateToken, vendorAuth, paymentPlanController.createPaymentPlan)

router.get('/get-all/:packageId', authenticateToken,  paymentPlanController.getAllPaymentPlan)

module.exports = router