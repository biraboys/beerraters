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
  style_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'style'
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
  ratings: Array,
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
    if (beer.name.includes(beerName)) return beer
  })
  return beerArr
})

const Beer = mongoose.model('beer', beerSchema)

module.exports = Beer
