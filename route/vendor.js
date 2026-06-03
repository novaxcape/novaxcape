const router = require('express').Router()
const vendorController = require('../controller/vendor')
const { authenticateToken } = require('../middleware/auth')
const {vendorSignUpValidator, verifyOtp, resendOtp, login, forgotPasswordValidator, resetPasswordValidator, changePasswordValidator} = require('../middleware/validation')

router.post('/register', vendorSignUpValidator, vendorController.register);
router.post('/verify-otp', verifyOtp, vendorController.verifyEmail)
router.post('/resend-otp', resendOtp, vendorController.resendOTP)
router.post('/login', login, vendorController.login)

router.post('/forget-password', forgotPasswordValidator, vendorController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, vendorController.resetPassword);
router.post('/change-password',  authenticateToken, changePasswordValidator, vendorController.changePassword);

module.exports = router