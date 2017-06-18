const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  edited: Date,
  beer: {
    type: Schema.Types.ObjectId,
    ref: 'beer'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Review = mongoose.model('review', reviewSchema)

module.exports = Review
