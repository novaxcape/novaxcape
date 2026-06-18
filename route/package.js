const express = require('express');
const router = express.Router();
const packageController = require('../controller/package');
const {createPackageValidation,updatePackageValidation} = require('../middleware/validation');
const {authenticateToken, adminAuth, vendorAuth} = require('../middleware/auth')


router.post('/:touristId', createPackageValidation, authenticateToken, vendorAuth, packageController.createPackage);
router.put('/package/:id',updatePackageValidation, authenticateToken, packageController.updatePackage);
router.get('/all/:touristId', authenticateToken,  packageController.getAllPackages);
router.get('/:id', authenticateToken, vendorAuth, packageController.getPackageById);
router.delete('/:id', authenticateToken, vendorAuth, packageController.deletePackage);

module.exports = router;