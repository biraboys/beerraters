const Review = require('../models/review')

module.exports = {
  getReview: async (req, res, next) => {
    const { reviewId } = req.params
    const review = await Review.findById(reviewId).populate('country_id user_id')
    res.json(review)
  }
}
