const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get((req, res, next) => {
    res.status(200).render('search')
  })
  .post(UsersController.findUser)

// router.route('/')
//   .get(UsersController.findUser)

module.exports = router
