const router = require('express-promise-router')()
const BeersController = require('../controllers/beers')
const multer = require('multer')
const upload = multer({ dest: `public/uploads/beers/` })
// const upload = multer({ dest: `http://192.168.1.225:3000/images/beer` })
const Beer = require('../models/beer')

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/public/uploads/beers')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + '.jpg')
//   }
// })

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
  .post(upload.any(), BeersController.addBeerImage)

router.route('/fetch/:beerId')
  .get(BeersController.getBeer)

router.get('/:beerId/images', async function (req, res, next) {
  const {beerId} = req.params
  const beer = await Beer.findById(beerId)
  res.json(beer.images)
})

module.exports = router
