const mongoose = require('mongoose')
const Schema = mongoose.Schema

const beerSchema = new Schema({
  name:
  {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  style_id: {
    type: Schema.Types.ObjectId,
    ref: 'style',
    required: true
  },
  style_name: String,
  category_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  category_name: String,
  brewery_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'brewery',
    required: true
  },
  brewery_name: String,
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country',
    required: true
  },
  country_name: String,
  ratings: [
    {
      rating: Number,
      user: { type: Schema.Types.ObjectId, ref: 'user' }
    }
  ],
  avg_rating: Number,
  reviews: [
    {
      review_id: { type: Schema.Types.ObjectId, ref: 'review' },
      user_id: { type: Schema.Types.ObjectId, ref: 'user' }
    }
  ],
  consumes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  images: [
    {
      data: Buffer,
      contentType: String,
      user_id: { type: Schema.Types.ObjectId, ref: 'user' }
    }
  ]
})

const Beer = mongoose.model('beer', beerSchema)

module.exports = Beer
