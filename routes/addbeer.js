const router = require('express-promise-router')()
const BeersController = require('../controllers/beers')

router.get('/', (req, res, next) => {
  res.render('addbeer', { session: req.session.user })
})

module.exports = router
