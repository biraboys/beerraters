const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  place: {
    type: String,
    required: true
  },
  country_id: {
    type: Schema.Types.ObjectId,
    ref: 'country',
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
  beer_id: {
    type: Schema.Types.ObjectId,
    ref: 'beer',
    required: true
  }
})

const Review = mongoose.model('review', reviewSchema)

module.exports = Review
