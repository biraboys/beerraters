const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.render('contact', { session: req.session.user })
  })
  .post(UsersController.feedback)

module.exports = router
