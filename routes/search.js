const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.status(200).render('search')
  })

router.route('/users')
  .get(UsersController.findUser)

// router.route('/breweries')
//   .get(UsersController.findBrewery)

// router.route('/beers')
//   .get(UsersController.findBeer)


module.exports = router
