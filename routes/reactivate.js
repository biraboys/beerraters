const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.render('reactivate', { session: req.session.user })
  })
  .post(UsersController.sendReactivationMail)

router.route('/:token')
  .get(UsersController.getReactivationToken)
  .post(UsersController.activateUserAccount)

module.exports = router
