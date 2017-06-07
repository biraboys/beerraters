const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  beer: String,
  body: {
    type: String,
    required: true
  },
  created: Date,
  updated: Date,
  rating: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Review = mongoose.model('review', reviewSchema)

module.exports = Review
