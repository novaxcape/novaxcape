const router = require('express').Router()
const touristController = require('../controller/tourist')
const { upload } = require('../middleware/multer');
const {authenticateToken,vendorAuth} = require('../middleware/auth')

router.post('/register', authenticateToken, vendorAuth, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'termsAndCondition', maxCount: 1 },
    { name: 'privacyPolicy', maxCount: 1 }
]), touristController.register)
router.get('/get-all-state/:state', touristController.getAllTouristsByState)
router.get('/get-one/:id', touristController.getOneTourist)

module.exports = router
