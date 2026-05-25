const express = require('express');
const router = express.Router();
const clientController = require('../controller/client');
const clientValidate = require('../middleware/validation')
const { authenticateToken } = require('../middleware/auth')
const { profile, loginProfile } = require('../middleware/passport');

router.post('/register', clientValidate.clientReg, clientController.register);
router.post('/verify-email', clientValidate.otpReg, clientController.verifyEmail);
router.post('/resend-otp', clientController.resendOTP);
router.post('/login', clientController.login);
router.put('/update-profile', clientController.updateProfile);

router.post('/forget-password', clientController.forgotPassword);
router.post('/reset-password', clientController.resetPassword);
router.post('/change-password', authenticateToken, clientController.changePassword)

router.get('/auth/google', profile);
router.get('/auth/google/callback', loginProfile, clientController.loginWithGoogle)

module.exports = router;