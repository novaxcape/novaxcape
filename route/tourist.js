const router = require('express').Router()
const touristController = require('../controller/tourist')
const { upload } = require('../middleware/multer');
const {authenticateToken,vendorAuth} = require('../middleware/auth')
const validate = require('../middleware/validation')

router.post('/register/:vendorId', authenticateToken, vendorAuth, validate.createTouristValidation, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'termsAndCondition', maxCount: 1 },
    { name: 'privacyPolicy', maxCount: 1 }
]), touristController.register)
router.get('/get-all-state/:state', touristController.getAllTouristsByState)
router.get('/get-one/:id', touristController.getOneTourist)
router.get('/get-all-opening-hours/:openingHours', touristController.getAllTouristsByOpeningHours)

router.post('/verify-client-passcode', authenticateToken, vendorAuth, validate.validateClientPasscode, touristController.verifyClientPasscode)
router.get('/getall', authenticateToken, vendorAuth, touristController.getallTourists)

module.exports = router
