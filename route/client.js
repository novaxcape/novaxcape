const express = require('express');
const router = express.Router();
const clientController = require('../controller/client');

router.post('/register', clientController.register);

router.post('/verify-email', clientController.verifyEmail);

router.post('/resend-otp', clientController.resendOTP);


router.post('/login', clientController.login);

module.exports = router;