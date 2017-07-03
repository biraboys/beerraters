const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    req.session.previousPage = req.header('Referer') || '/'
    res.render('login', { success: '', username: '', message: '', session: req.session.user })
  })
  .post(UsersController.loginUser)

module.exports = router
