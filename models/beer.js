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

beerSchema.static('findByStyle', function (beerArr, beerName) {
  beerArr = beerArr.filter(beer => {
    if (beer.style_id) {
      if (beer.style_id.name.toLowerCase().includes(beerName.toLowerCase())) return beer
    }
  })
  return beerArr
})

beerSchema.static('findByBrewery', function (beerArr, beerName) {
  beerArr = beerArr.filter(beer => {
    if (beer.brewery_id) {
      if (beer.brewery_id.name.toLowerCase().includes(beerName.toLowerCase())) return beer
    }
  })
  return beerArr
})

beerSchema.static('findByCountry', function (beerArr, beerName) {
  beerArr = beerArr.filter(beer => {
    if (beer.country_id) {
      if (beer.country_id.name.toLowerCase() === beerName.toLowerCase() || beer.country_id.code.toLowerCase() === beerName.toLowerCase()) return beer
    }
  })
  return beerArr
})

const Beer = mongoose.model('beer', beerSchema)

module.exports = Beer
