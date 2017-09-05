const router = require('express-promise-router')()
const BrewerysController = require('../controllers/breweries')

router.route('/')
  .get(BrewerysController.index)
  .post(BrewerysController.newBrewery)

router.route('/:breweryId')
  .get(BrewerysController.getBrewery)

module.exports = router
