const router = require('express-promise-router')()
const UsersController = require('../controllers/users')
const multer = require('multer')
const upload = multer({ dest: `public/uploads/users/` })

router.route('/')
  .get(UsersController.index)
  .post(UsersController.newUser)

router.route('/:userId')
  .get(UsersController.getUser)

router.route('/:userId/json')
  .get(UsersController.getUserJson)

router.route('/:userId/follow')
  .post(UsersController.followUser)

router.route('/:userId/reviews')
  .get(UsersController.getUserReviews)
  .post(UsersController.newUserReview)

router.route('/:userId/edit')
  .post(upload.any(), UsersController.editProfile)

router.route('/:userId/changepassword')
  .post(UsersController.changePassword)

router.route('/:userId/check-pass')
  .post(UsersController.checkUserPassword)

router.route('/:userId/remove-account')
  .post(UsersController.removeUserAccount)

router.get('/:userId/edit', function (req, res) {
  if (req.session.user._id === req.params.userId) {
    res.status(200).render('edit', { session: req.session.user })
  } else {
    // res.status(401).json({ message: 'You dont have access to this page.' })
    res.redirect(`/users/${req.session.user._id}`)
  }
})

router.route('/:userId/following')
  .get(UsersController.getUserFollowing)

module.exports = router
