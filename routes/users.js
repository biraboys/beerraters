const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get(UsersController.index)
  .post(UsersController.newUser)

router.route('/search')
  .get(UsersController.getUser)

router.route('/:userId/reviews')
  .get(UsersController.getUserReviews)
  .post(UsersController.newUserReview)

module.exports = router
