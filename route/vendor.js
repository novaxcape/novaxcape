const router = require('express').Router()
const vendorController = require('../controller/vendor')
const { authenticateToken } = require('../middleware/auth')

router.post('/register',  vendorController.register);
router.post('/verify-otp', vendorController.verifyEmail)

module.exports = router