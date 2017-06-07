const Brewery = require('../models/brewery')
// const Review = require('../models/review')

module.exports = {
  index: async (req, res, next) => {
    const brewerys = await Brewery.find({})
    res.status(200).render('brewerys', {brewerys})
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
