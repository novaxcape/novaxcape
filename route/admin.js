const router = require('express').Router();
const adminController = require('../controller/admin');

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/forgot-password', adminController.forgotPassword);

module.exports = router