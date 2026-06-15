const router = require('express').Router()
const reviewController = require('../controller/review')
const { authenticateToken, clientAuth } = require('../middleware/auth')

router.post('/review', authenticateToken, clientAuth, reviewController.createReview)
router.get('/get-all-review', authenticateToken, clientAuth, reviewController.getAllReview)
router.get('/get-rating-statistics', authenticateToken, clientAuth, reviewController.getRatingStatistics)
router.get('/get-rating-count/:ratings', authenticateToken, clientAuth, reviewController.getAllByRatings)
router.get('/get-one-review/:id', authenticateToken, clientAuth, reviewController.getOneReview)

module.exports = router
