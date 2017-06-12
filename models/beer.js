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
    type: Number,
    required: true
  },
  category:
  {
    // type: Schema.Types.ObjectId,
    // ref: 'category'
  },
  style:
  {
    // type: Schema.Types.ObjectId,
    // ref: 'style'
  },
  country: {
    // type: Schema.Types.ObjectId,
    // ref: 'country'
  }
})
beerSchema.static('findByName', function (beerArr, beerName) {
  beerArr = beerArr.filter(beer => {
    if (beer.name.includes(beerName)) return beer
  })
  return beerArr
})

const Beer = mongoose.model('beer', beerSchema)

module.exports = Beer
