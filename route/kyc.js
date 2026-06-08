const router = require('express').Router()
const kycController = require('../controller/kyc')
const { createKycValidation } = require('../middleware/validation')

router.post('/', createKycValidation, kycController.createKyc)

module.exports = router;