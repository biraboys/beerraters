const mongoose = require('mongoose')
const Schema = mongoose.Schema

const countrySchema = new Schema({
  name: String,
  code: String,
  flag: String,
  lat: String,
  long: String,
  zoom: String,
  breweries: [
    {
      type: Schema.Types.ObjectId,
      ref: 'brewery'
    }
  ],
  beers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'beer'
    }
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ]
})

const Country = mongoose.model('country', countrySchema)

module.exports = Country
