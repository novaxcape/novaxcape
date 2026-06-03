const express = require('express');
const router = express.Router();
const clientController = require('../controller/client');
const clientValidate = require('../middleware/validation');
const { authenticateToken, adminAuth } = require('../middleware/auth');
const { profile, loginProfile } = require('../middleware/passport');
const { upload } = require('../middleware/multer');

router.post('/register', clientValidate.clientReg, clientController.register);
router.post('/verify-email', clientValidate.verifyOtp, clientController.verifyEmail);
router.post('/resend-otp', clientValidate.resendOtp, clientController.resendOTP);
router.post('/login', clientValidate.login, clientController.login);
router.put('/update-profile', authenticateToken, upload.single('profilePicture'), clientValidate.updateProfile, clientController.updateProfile);

router.post('/forget-password', clientValidate.forgotPasswordValidator, clientController.forgotPassword);
router.post('/reset-password', clientValidate.resetPasswordValidator, clientController.resetPassword);
router.post('/change-password', authenticateToken, clientValidate.changePasswordValidator, clientController.changePassword)

router.get('/auth/google', profile);
router.get('/auth/google/callback', loginProfile, clientController.loginWithGoogle);

router.get('/get-one/:id', adminAuth, clientController.getOneClient);
router.get('/get-all', adminAuth, clientController.getAllClients);

module.exports = router;