const router = require('express').Router()
const kycController = require('../controller/kyc')
const {authenticateToken,vendorAuth} = require('../middleware/auth')

router.post('/:touristId', authenticateToken, vendorAuth, kycController.createKyc)

module.exports = router;
