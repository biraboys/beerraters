const mongoose = require('mongoose')
const Schema = mongoose.Schema

const beerSchema = new Schema({
  name:
  {
    type: String,
    required: true
  },
  description: '',
  style_id: {
    type: Schema.Types.ObjectId,
    ref: 'style',
    required: true
  },
  category_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  brewery_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'brewery',
    required: true
  },
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country',
    required: true
  },
  ratings: [
    {
      rating: Number,
      user: { type: Schema.Types.ObjectId, ref: 'user' }
    }
  ],
  avg_rating: Number,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
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
      name: String,
      user_id: { type: Schema.Types.ObjectId, ref: 'user' }
    }
  ]
})

beerSchema.static('findByName', function (beerArr, beerName) {
  beerArr = beerArr.filter(beer => {
    if (beer.name.toLowerCase().includes(beerName.toLowerCase())) return beer
  })
  return beerArr
})

const Beer = mongoose.model('beer', beerSchema)

module.exports = Beer
