const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ratingSchema = new Schema({
  rating: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Rating = mongoose.model('rating', ratingSchema)

module.exports = Rating
