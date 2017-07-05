const Review = require('../models/review')

module.exports = {
  getReview: async (req, res, next) => {
    const { reviewId } = req.params
    const review = await Review.findById(reviewId)
    res.json(review)
  }
}
