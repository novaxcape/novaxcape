const router = require('express').Router()
const withdrawalController = require('../controller/withdrawal')
const { authenticateToken, vendorAuth } = require('../middleware/auth')


router.post('/payout-funds/:id', authenticateToken,  vendorAuth, withdrawalController.payoutFunds)

module.exports = router