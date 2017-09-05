const router = require('express-promise-router')()
const UsersController = require('../controllers/users')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
    files: 1
  }
})

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

router.route('/:userId/get-profileimage')
  .get(UsersController.getProfileImage)

router.route('/:userId/edit')
  .post(upload.single('profileImg'), UsersController.editProfile)

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
    res.redirect(`/users/${req.session.user._id}`)
  }
})

router.route('/feed/:feedId')
  .post(UsersController.removeFeedItem)

router.route('/:userId/following')
  .get(UsersController.getUserFollowing)

router.route('/:userId/userImages')
  .post(UsersController.getUserImages)

module.exports = router
