const router = require('express-promise-router')()
const BrewerysController = require('../controllers/breweries')

const { validateParams, schemas } = require('../helpers/routeHelpers')

router.route('/')
  .get(BrewerysController.index)
  .post(BrewerysController.newBrewery)

router.route('/:breweryId')
  .get(validateParams(schemas.idSchema, 'breweryId'), BrewerysController.getBrewery)

module.exports = router
