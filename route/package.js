const express = require('express');
const router = express.Router();

const packageController = require('../controller/package');
const {createPackageValidation,updatePackageValidation} = require('../middleware/validation');


router.post('/', packageController.createPackage);
router.get('/all', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

router.post('/package',createPackageValidation,packageController.createPackage);

router.put('/package/:id',updatePackageValidation,packageController.updatePackage);

module.exports = router;