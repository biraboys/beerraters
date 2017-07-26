const router = require('express-promise-router')()

router.get('/', function (req, res, next) {
  res.render('panel', { session: req.session.user })
})

module.exports = router
