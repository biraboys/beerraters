const router = require('express-promise-router')()
const BeersController = require('../controllers/beers')

router.get('/', async function (req, res, next) {
  res.render('toplist', {session: req.session.user})
})

router.route('/getBeers')
  .get(BeersController.getTopRatedBeers)

module.exports = router
