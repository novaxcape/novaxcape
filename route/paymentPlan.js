const router = require('express').Router()
const paymentPlanController = require('../controller/paymentPlan')
const {authenticateToken, clientAuth} = require('../middleware/auth')

router.post('/create-plan/:packageId', authenticateToken, clientAuth, paymentPlanController.createPaymentPlan)

module.exports = router