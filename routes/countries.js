const router = require('express-promise-router')()
const CountriesController = require('../controllers/countries')

router.route('/')
  .get(CountriesController.index)

router.route('/:countryId')
  .get(CountriesController.getCountry)

module.exports = router
