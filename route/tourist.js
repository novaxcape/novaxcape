const router = require('express').Router()
const touristController = require('../controller/tourist')
const { upload } = require('../middleware/multer');
const { registerTouristCenterValidator } = require('../middleware/validation');

router.post('/register', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'termsAndCondition', maxCount: 1 },
    { name: 'privacyPolicy', maxCount: 1 }
]), 
registerTouristCenterValidator, touristController.register)

module.exports = router
