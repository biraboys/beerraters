const router = require('express-promise-router')()
const BeersController = require('../controllers/beers')

router.route('/')
  .get(BeersController.index)
  .post(BeersController.newBeer)

router.route('/:beerId')
  .get(BeersController.getBeer)
  .patch(BeersController.updateBeer)

router.route('/:beerId/category')
  .get(BeersController.getBeerCategory)
  .post(BeersController.newBeerCategory)

router.route('/:beerId/brewery')
  .get(BeersController.getBeerBrewery)

module.exports = router
