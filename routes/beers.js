const router = require('express-promise-router')()
const BeersController = require('../controllers/beers')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50000000,
    files: 1
  }
})
const Beer = require('../models/beer')

router.route('/')
  .get(BeersController.index)
  .post(BeersController.newBeer)

router.route('/add')
  .get(BeersController.addBeer)
  .post(BeersController.newBeer)

router.route('/:beerId')
  .get(BeersController.renderBeer)
  .post(BeersController.updateBeer)

router.route('/:beerId/consume')
  .post(BeersController.consumeBeer)

router.route('/:beerId/review')
  .get(BeersController.getReviews)
  .post(BeersController.addBeerReview)

router.route('/:beerId/rating')
  .get(BeersController.getAverageRating)
  .post(BeersController.addBeerRating)

router.route('/:beerId/contributions')
  .get(BeersController.getContributions)

router.route('/:beerId/addImage')
  .post(upload.single('img'), BeersController.addBeerImage)

router.route('/:beerId/getImage')
  .post(BeersController.getBeerImage)

router.route('/fetch/:beerId')
  .get(BeersController.getBeer)

router.get('/:beerId/images', async function (req, res, next) {
  const {beerId} = req.params
  const beer = await Beer.findById(beerId)
  res.json(beer.images.length)
})

module.exports = router
