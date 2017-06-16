const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.render('register', { success: '', message: '', username: '', name: '', email: '' })
  })
  .post(UsersController.newUser)

module.exports = router
