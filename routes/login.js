const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    // req.session.user.previousPage = req.header('Referer') || '/'
    // console.log(req.session.previousPage)
    // res.render('login')
    res.render('login', { session: req.session.user })
  })
  .post(UsersController.loginUser)

module.exports = router
