const router = require('express-promise-router')()
const UsersController = require('../controllers/users')
const BeersController = require('../controllers/beers')
const BreweriesController = require('../controllers/breweries')

router.route('/')
  .get((req, res, next) => {
    res.status(200).render('search')
  })

router.route('/users')
  .get(UsersController.findUser)

router.route('/breweries')
  .get(BreweriesController.findBrewery)

router.route('/beers')
  .get(BeersController.findBeer)

module.exports = router
