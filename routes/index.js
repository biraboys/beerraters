const router = require('express-promise-router')()

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
