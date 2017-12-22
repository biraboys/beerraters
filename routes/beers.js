const router = require('express-promise-router')()
const BeersController = require('../controllers/beers')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
    files: 1
  }
})
const { validateParams, validateBody, schemas } = require('../helpers/routeHelpers')

router.route('/add')
  .get(BeersController.addBeer)
  .post(validateBody(schemas.beerSchema), BeersController.newBeer)

router.route('/:beerId')
  .get(validateParams(schemas.idSchema, 'beerId'), BeersController.renderBeer)
  // .post(BeersController.updateBeer)

router.route('/:beerId/consume')
  .post(validateParams(schemas.idSchema, 'beerId'), BeersController.consumeBeer)

router.route('/:beerId/name')
  .get(validateParams(schemas.idSchema, 'beerId'), BeersController.getBeerName)

router.route('/:beerId/review')
  .get(validateParams(schemas.idSchema, 'beerId'), BeersController.getReviews)
  .post([
    validateParams(schemas.idSchema, 'beerId'),
    validateBody(schemas.reviewSchema)
  ],
  BeersController.addBeerReview)

router.route('/:beerId/rating')
  .get(validateParams(schemas.idSchema, 'beerId'), BeersController.getAverageRating)
  .post([
    validateParams(schemas.idSchema, 'beerId'),
    validateBody(schemas.ratingSchema)
  ],
  BeersController.addBeerRating)

router.route('/:beerId/contributions')
  .get(validateParams(schemas.idSchema, 'beerId'), BeersController.getContributions)

router.route('/:beerId/addImage')
  .post([
    validateParams(schemas.idSchema, 'beerId'),
    upload.single('img')
  ],
    BeersController.addBeerImage)

router.route('/:beerId/getImage')
  .get(validateParams(schemas.idSchema, 'beerId'), BeersController.getBeerImage)
  .post(validateParams(schemas.idSchema, 'beerId'), BeersController.getBeerImages)

router.route('/fetch/:beerId')
  .get(validateParams(schemas.idSchema, 'beerId'), BeersController.getBeer)

module.exports = router
