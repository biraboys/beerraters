const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validate = require('mongoose-validator')

const objectIdValidator = [
  validate({
    validator: 'isLength',
    arguments: [10, 50],
    message: 'ObjectId must be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'ObjectId must contain letters and numbers only.'
  })
]

const beerSchema = new Schema({
  name:
  {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  style_id: {
    type: Schema.Types.ObjectId,
    ref: 'style',
    required: true,
    validate: objectIdValidator
  },
  style_name: String,
  category_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
    validate: objectIdValidator
  },
  category_name: String,
  brewery_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'brewery',
    required: true,
    validate: objectIdValidator
  },
  brewery_name: String,
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country',
    required: true,
    validate: objectIdValidator
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
