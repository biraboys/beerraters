const router = require('express-promise-router')()
const CountriesController = require('../controllers/countries')

router.route('/')
  .get(CountriesController.index)

router.route('/:countryId')
  .get(CountriesController.getCountry)

router.route('/:countryId/breweries')
  .get(CountriesController.getBreweries)

router.route('/:countryId/states')
  .get(CountriesController.getStates)

module.exports = router
