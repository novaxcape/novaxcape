const router = require('express').Router()
const vendorController = require('../controller/vendor')
const vendorDashboardController = require('../controller/vendorDashboard')
const { authenticateToken, vendorAuth } = require('../middleware/auth')
const {vendorSignUpValidator, verifyOtp, resendOtp, login, forgotPasswordValidator, resetPasswordValidator, changePasswordValidator} = require('../middleware/validation')

router.post('/register', vendorSignUpValidator, vendorController.register);
router.post('/verify-otp', verifyOtp, vendorController.verifyEmail)
router.post('/resend-otp', resendOtp, vendorController.resendOTP)
router.post('/login', login, vendorController.login)

router.post('/forget-password', forgotPasswordValidator, vendorController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, vendorController.resetPassword);
router.put('/change-password',  authenticateToken, vendorDashboardController.updatePassword);
router.get('/dashboard', authenticateToken, vendorAuth, vendorDashboardController.getDashboardStats);
router.put('/update', authenticateToken, vendorDashboardController.updateVendorDashboard);


module.exports = router