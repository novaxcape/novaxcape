const router = require('express').Router()
const kycController = require('../controller/kyc')
const {authenticateToken,vendorAuth} = require('../middleware/auth');
const { createKycValidation } = require('../middleware/validation');

router.post('/:touristId', authenticateToken, vendorAuth, createKycValidation, kycController.createKyc)

module.exports = router;