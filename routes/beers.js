const router = require('express-promise-router')()
const BeersController = require('../controllers/beers')

router.route('/')
  .get(BeersController.index)
  .post(BeersController.newBeer)

router.route('/add')
  .get(BeersController.addBeer)
  .post(BeersController.newBeer)

router.route('/:beerId')
  .get(BeersController.renderBeer)
  .patch(BeersController.updateBeer)

router.route('/:beerId/consume')
  .get(BeersController.checkIfConsumed)
  .post(BeersController.consumeBeer)

router.route('/:beerId/category')
  .get(BeersController.getBeerCategory)
  .post(BeersController.newBeerCategory)

router.route('/:beerId/brewery')
  .get(BeersController.getBeerBrewery)

router.route('/:beerId/description')
  .post(BeersController.addBeerDescription)

router.route('/:beerId/rating')
  .get(BeersController.getAverageRating)
  .post(BeersController.addBeerRating)

router.route('/fetch/:beerId')
  .get(BeersController.getBeer)

module.exports = router
