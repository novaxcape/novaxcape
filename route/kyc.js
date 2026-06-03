const router = require('express').Router()
const kycController = require('../controller/kyc')

router.post('/', kycController.createKyc)

module.exports = router;