const router = require('express-promise-router')()
const BrewerysController = require('../controllers/breweries')

router.route('/')
  .get(BrewerysController.index)
  .post(BrewerysController.newBrewery)

router.route('/:breweryId')
  .get(BrewerysController.getBrewery)

// router.route('/:userId/reviews')
//   .get(BeersController.getUserReviews)
//   .post(BeersController.newUserReview)

module.exports = router
