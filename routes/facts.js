const router = require('express-promise-router')()

router.get('/', (req, res, next) => {
  res.io.emit('socketToMe', 'users')
  res.end()
  // res.render('facts', { title: 'Beer Facts', session: req.session.user })
})

module.exports = router
