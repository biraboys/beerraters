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

const { validateParams, schemas } = require('../helpers/routeHelpers')

router.route('/')
  .get(UsersController.index)
  .post(UsersController.newUser)

router.route('/:userId')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUser)

router.route('/:userId/json')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserJson)

router.route('/:userId/follow')
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.followUser)

router.route('/:userId/reviews')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserReviews)
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.newUserReview)

router.route('/:userId/get-profileimage')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getProfileImage)

router.route('/:userId/edit')
  .post([
    validateParams(schemas.idSchema, 'userId'),
    upload.single('profileImg')],
    UsersController.editProfile)

router.route('/:userId/changepassword')
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.changePassword)

router.route('/:userId/check-pass')
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.checkUserPassword)

router.route('/:userId/remove-account')
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.removeUserAccount)

router.route('/:userId/edit')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.checkUser)

router.route('/feed/:feedId')
  .post(validateParams(schemas.idSchema, 'feedId'), UsersController.removeFeedItem)

router.route('/:userId/following')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserFollowing)

router.route('/:userId/userImages')
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.getUserImages)

module.exports = router
