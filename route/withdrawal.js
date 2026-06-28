const router = require('express').Router()
const withdrawalController = require('../controller/withdrawal')
const { authenticateToken, vendorAuth } = require('../middleware/auth')


router.post('/payout-funds/:id', authenticateToken,  vendorAuth, withdrawalController.payoutFunds)
router.get('/withdrawals/:id', authenticateToken, vendorAuth, withdrawalController.getTouristWithdrawals)

module.exports = router
