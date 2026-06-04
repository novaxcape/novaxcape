const express = require('express');
const router = express.Router();

const packageController = require('../controller/package');
const {createPackageValidation,updatePackageValidation} = require('../middleware/validation');


router.post('/', createPackageValidation, packageController.createPackage);
router.put('/package/:id',updatePackageValidation,packageController.updatePackage);
router.get('/all', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.delete('/:id', packageController.deletePackage);

module.exports = router;