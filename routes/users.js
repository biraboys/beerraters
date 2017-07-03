const router = require('express-promise-router')()
const UsersController = require('../controllers/users')

router.route('/')
  .get(UsersController.index)
  .post(UsersController.newUser)

router.route('/:userId')
  .get(UsersController.getUser)

router.route('/:userId/follow')
  .post(UsersController.followUser)

router.route('/:userId/reviews')
  .get(UsersController.getUserReviews)
  .post(UsersController.newUserReview)

router.route('/:userId/edit')
  .post(UsersController.editProfile)

router.get('/:userId/edit', function (req, res) {
  if (req.session.user._id === req.params.userId) {
    res.status(200).render('edit', { session: req.session.user })
  } else {
    res.status(401).json({ message: 'You dont have access to this page.' })
  }
})

router.route('/:userId/followers')
  .get(UsersController.getUserFollowers)

module.exports = router
