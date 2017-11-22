const router = require('express-promise-router')()

router.get('/', (req, res, next) => {
  res.render('facts', { session: req.session.user })
})

module.exports = router
