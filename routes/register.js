const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get(async (req, res, next) => {
    res.render('register', { session: req.session.user })
  })
  .post(UsersController.newUser)

router.route('/:username')
  .get(UsersController.getLoginPageFromActivationEmail)
  .post(UsersController.loginUser)

module.exports = router
