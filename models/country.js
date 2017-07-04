const mongoose = require('mongoose')
const Schema = mongoose.Schema

const countrySchema = new Schema({
  name:
  {
    type: String,
    required: true
  },
  code:
  {
    type: String,
    required: true
  },
  flag:
  {
    type: String,
    required: true
  },
  lat:
  {
    type: String,
    required: true
  },
  long:
  {
    type: String,
    required: true
  },
  zoom:
  {
    type: String,
    required: true
  },
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
