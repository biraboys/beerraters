const router = require('express-promise-router')()
const ReviewsController = require('../controllers/reviews')

router.route('/:reviewId')
  .get(ReviewsController.getReview)
  .post(ReviewsController.editReview)

module.exports = router
