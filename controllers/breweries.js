const Brewery = require('../models/brewery')
const json = require('../breweries.json')

module.exports = {
  index: async (req, res, next) => {
    const firstBrewery = {
      _id: json.breweries[806].id,
      name: json.breweries[806].name,
      city: json.breweries[806].city,
      country: json.breweries[806].country,
      description: json.breweries[806].descript
    }
    const newBrewery = new Brewery(firstBrewery)
    const brewery = await newBrewery.save()
    res.status(201).json(brewery)
  },
  newBrewery: async (req, res, next) => {
    const newBrewery = new Brewery(req.body)
    const brewery = await newBrewery.save()
    res.status(201).json(brewery)
  },
  getBrewery: async (req, res, next) => {
    const { breweryId } = req.params
    const brewery = await Brewery.findById(breweryId)
    res.status(200).render('brewery', {brewery})
  },
  findBrewery: async(req, res, next) => {
    const breweryName = req.query.q
    const allBreweries = await Brewery.find({})
    const breweries = await Brewery.findByName(allBreweries, breweryName)
    res.status(200).render('breweries', {breweries: breweries, breweryName: breweryName})
    // let beer
    // if (beerArr[0] !== undefined) beer = beerArr[0].toObject()
    // res.status(200).json(beer)
  }
//   getUserReviews: async (req, res, next) => {
//     const { userId } = req.params
//     const userReviews = await User.findById(userId).populate('reviews')
//     res.status(200).render('reviews', userReviews)
//   },
//   newUserReview: async (req, res, next) => {
//     const { userId } = req.params
//     // Create a new review
//     const newReview = new Review(req.body)
//     // Get user
//     const user = await User.findById(userId)
//     // Bind review and user
//     newReview.user = user
//     // Save review
//     await newReview.save()
//     // Add review to user
//     user.reviews.push(newReview)
//     // Save user
//     await user.save()

//     res.status(201).json(newReview)
//   }
}
