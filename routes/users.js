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
  .post(UsersController.newUser)

router.route('/:userId')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.renderUser)

router.route('/:userId/userJson')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.userJson)

router.route('/:userId/follow')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.followUser)

router.route('/:userId/consumes')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserConsumes)

router.route('/:userId/ratings')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserRatings)

router.route('/:userId/reviews')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserReviews)
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.newUserReview)

router.route('/:userId/profileImage')
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

router.route('/:userId/following')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserFollowing)

router.route('/:userId/followers')
  .get(validateParams(schemas.idSchema, 'userId'), UsersController.getUserFollowers)

router.route('/:userId/userImages')
  .post(validateParams(schemas.idSchema, 'userId'), UsersController.getUserImages)

module.exports = router
