const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .post(UsersController.logoutUser)

module.exports = router
