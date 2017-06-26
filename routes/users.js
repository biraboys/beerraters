const router = require('express-promise-router')()
const multer = require('multer')
const UsersController = require('../controllers/users')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

const upload = multer({ storage: storage }).single('profileImage')

router.route('/')
  .get(UsersController.index)
  .post(UsersController.newUser)

router.route('/:userId')
  .get(UsersController.getUser)

router.post('/:userId/follow', function (req, res, next) {
  UsersController.followUser(req)
})

router.route('/:userId/follow')
  .get(UsersController.followUser)
  
// router.route('/:userId/follow')
//   .post(UsersController.followUser)

router.route('/:userId/unfollow')
  .post(UsersController.unfollowUser)

router.route('/:userId/reviews')
  .get(UsersController.getUserReviews)
  .post(UsersController.newUserReview)

router.post('/:userId/edit', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
    }
    UsersController.editProfile(req)
    res.json({ success: true, message: 'Image uploaded!' })
  })
})

router.get('/:userId/edit', function (req, res) {
  res.render('edit', { session: req.session.user })
})

module.exports = router
