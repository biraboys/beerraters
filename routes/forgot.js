const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.get('/', function (req, res) {
  res.render('forgot', { session: req.session.user })
})

router.route('/')
  .post(UsersController.forgotPassword)

module.exports = router
