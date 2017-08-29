const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
    .post(UsersController.reportBug)

module.exports = router
