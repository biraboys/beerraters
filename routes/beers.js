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
  .post(BeersController.updateBeer)

router.route('/:beerId/consume')
  .post(BeersController.consumeBeer)

router.route('/:beerId/rating')
  .get(BeersController.getAverageRating)
  .post(BeersController.addBeerRating)

router.route('/:beerId/contributions')
  .get(BeersController.getContributions)

router.route('/fetch/:beerId')
  .get(BeersController.getBeer)

module.exports = router
