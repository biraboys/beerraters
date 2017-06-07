const mongoose = require('mongoose')
const Schema = mongoose.Schema

const beerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: '',
  ratings: Array,
  average_rating: 0,
  img_path: 'String',
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
    }
  ],
  created: { type: Date, default: Date.now },
  updated: Date,
  brewery_id: {
    type: Schema.Types.ObjectId,
    ref: 'brewery'
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: 'category'
    }
  ],
  style_id: {
    type: Schema.Types.ObjectId,
    ref: 'style'
  },
  country_id: {
    type: Schema.Types.ObjectId,
    ref: 'country'
  }
})

const Beer = mongoose.model('beer', beerSchema)

module.exports = Beer
