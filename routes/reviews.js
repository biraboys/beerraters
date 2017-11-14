const router = require('express-promise-router')()
const ReviewsController = require('../controllers/reviews')

const { validateParams, schemas } = require('../helpers/routeHelpers')

router.route('/:reviewId')
  .get(validateParams(schemas.idSchema, 'reviewId'), ReviewsController.getReview)
  .post(ReviewsController.editReview)

module.exports = router
