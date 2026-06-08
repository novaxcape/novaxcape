const express = require('express');
const router = express.Router();
const packageController = require('../controller/package');
const {createPackageValidation,updatePackageValidation} = require('../middleware/validation');
const {authenticateToken, adminAuth, vendorAuth} = require('../middleware/auth')


router.post('/', createPackageValidation, authenticateToken, vendorAuth, packageController.createPackage);
router.put('/package/:id',updatePackageValidation, authenticateToken, vendorAuth,packageController.updatePackage);
router.get('/all', authenticateToken, vendorAuth, packageController.getAllPackages);
router.get('/:id', authenticateToken, vendorAuth, packageController.getPackageById);
router.delete('/:id', authenticateToken, vendorAuth, packageController.deletePackage);

module.exports = router;