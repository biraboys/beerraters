const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.render('register', { session: req.session.user })
  })
  .post(UsersController.newUser)

router.route('/:username')
  .get((req, res, next) => {
    const { username } = req.params
    res.render('login', { success: true, username: username, session: req.session.user })
  })
  .post(UsersController.loginUser)

module.exports = router
