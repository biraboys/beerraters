const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/:token')
  .get(UsersController.findToken)
  .post(UsersController.resetPassword)

module.exports = router
