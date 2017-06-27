const mongoose = require('mongoose')
const Schema = mongoose.Schema

const beerSchema = new Schema({
  name:
  {
    type: String,
    required: true
  },
  description: '',
  category_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'category'
  },
  brewery_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'brewery'
  },
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country'
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
