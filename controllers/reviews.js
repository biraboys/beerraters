const Review = require('../models/review')

module.exports = {
  getReview: async (req, res, next) => {
    const { reviewId } = req.params
    const review = await Review.findById(reviewId).populate('country_id user_id', 'name username')
    res.status(200).json(review)
  }
  // editReview: async (req, res, next) => {
  //   const { reviewId } = req.params
  //   const review = req.body.review
  //   await Review.findByIdAndUpdate(reviewId, { $set: { body: review } })
  //   res.end()
  // }
}
