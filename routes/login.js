const router = require('express-promise-router')()
// const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.render('login', { success: '', username: '' })
  })

module.exports = router
