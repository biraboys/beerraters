const router = require('express-promise-router')()
const UsersController = require('../controllers/users')
const BeersController = require('../controllers/beers')
const BreweriesController = require('../controllers/breweries')

router.route('/')
  .get((req, res, next) => {
    res.status(200).render('search', { session: req.session.user })
  })

router.route('/users')
  .get(UsersController.findUser)

router.route('/breweries')
  .get(BreweriesController.findBrewery)

router.route('/beers/name')
  .get(BeersController.findBeerByName)

router.route('/beers/style')
  .get(BeersController.findBeerByStyle)

router.route('/beers/brewery')
  .get(BeersController.findBeerByBrewery)

router.route('/beers/country')
  .get(BeersController.findBeerByCountry)

module.exports = router
