const router = require('express-promise-router')()
const CountriesController = require('../controllers/countries')

const { validateParams, schemas } = require('../helpers/routeHelpers')

router.route('/')
  .get(CountriesController.index)

router.route('/:countryId')
  .get(validateParams(schemas.idSchema, 'countryId'), CountriesController.getCountry)

router.route('/:countryId/json')
  .get(validateParams(schemas.idSchema, 'countryId'), CountriesController.getCountryJson)

router.route('/:countryId/breweries')
  .get(validateParams(schemas.idSchema, 'countryId'), CountriesController.getBreweries)

router.route('/:countryId/states')
  .get(validateParams(schemas.idSchema, 'countryId'), CountriesController.getStates)

module.exports = router
