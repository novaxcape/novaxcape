const express = require('express');
const router = express.Router();
const clientController = require('../controller/client');
const clientValidate = require('../middleware/validation')
const { authenticateToken } = require('../middleware/auth')
const { profile, loginProfile } = require('../middleware/passport');

router.post('/register', clientValidate.clientReg, clientController.register);
router.post('/verify-email', clientValidate.verifyOtp, clientController.verifyEmail);
router.post('/resend-otp', clientValidate.resendOtp, clientController.resendOTP);
router.post('/login', clientValidate.login, clientController.login);
router.put('/update-profile', clientValidate.updateProfile, clientController.updateProfile);

router.post('/forget-password', clientValidate.forgotPasswordValidator, clientController.forgotPassword);
router.post('/reset-password', clientValidate.resetPasswordValidator, clientController.resetPassword);
router.post('/change-password', authenticateToken, clientValidate.changePasswordValidator, clientController.changePassword)

router.get('/auth/google', profile);
router.get('/auth/google/callback', loginProfile, clientController.loginWithGoogle)

module.exports = router;