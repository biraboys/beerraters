const router = require('express-promise-router')()
// const UsersController = require('../controllers/users')

router.get('/', function (req, res, next) {
  res.render('login')
})
  // .post(UsersController.newUser)

module.exports = router
