const router = require('express-promise-router')()

router.get('/', (req, res, next) => {
  res.render('facts', {title: 'Beer Facts'})
})

module.exports = router
