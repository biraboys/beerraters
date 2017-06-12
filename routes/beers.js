const router = require('express-promise-router')()
// const BeersController = require('../controllers/beers')

router.route('/')
  // .get(BeersController.index)
  // .post(BeersController.newBeer)

router.route('/:beerId')
  // .get(BeersController.getBeer)

router.route('/:beerId/category')
  // .get(BeersController.getBeerCategory)
  // .post(BeersController.newBeerCategory)

module.exports = router
