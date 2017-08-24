const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.get('/', function (req, res) {
  res.render('resend', { session: req.session.user })
})

router.route('/')
  .post(UsersController.resendActivationMail)

module.exports = router
