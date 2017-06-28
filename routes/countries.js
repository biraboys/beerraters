const router = require('express-promise-router')()
const CountriesController = require('../controllers/countries')

router.route('/')
  .get(CountriesController.index)

router.route('/:countryId')
  .get(CountriesController.getCountry)

router.route('/:countryName/breweries')
  .get(CountriesController.getBreweries)

module.exports = router
