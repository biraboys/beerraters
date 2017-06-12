const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.render('register', { success: '', message: '' })
  })
  .post(UsersController.newUser)

module.exports = router
