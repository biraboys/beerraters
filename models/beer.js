const mongoose = require('mongoose')
const Schema = mongoose.Schema

const beerSchema = new Schema({
  name:
  {
    type: String,
    required: true
  },
  description: '',
  type_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'type',
    required: true
  },
  style_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'style',
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
      type: Schema.Types.ObjectId,
      ref: 'rating'
    }
  ],
  avg_rating: Number,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
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
