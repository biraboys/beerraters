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
beerSchema.static('findByName', function (beer, callback) {
  const test = this.find({}, (err, beers) => {
   const beerArr = beers.filter(function(element) {
      if (element.name.includes(beer)) return element
    })
  return beerArr
})
return test

const Beer = mongoose.model('beer', beerSchema)

module.exports = Beer
