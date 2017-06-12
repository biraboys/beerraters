const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brewerySchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  city: String,
  country: String,
  description: String,
  created: { type: Date, default: Date.now }
})


brewerySchema.static('findByName', function (breweryArr, breweryName) {
  breweryArr = breweryArr.filter(brewery => {
    if (brewery.name.includes(breweryName)) return brewery
  })
  return breweryArr
})


const Brewery = mongoose.model('brewery', brewerySchema)

module.exports = Brewery
