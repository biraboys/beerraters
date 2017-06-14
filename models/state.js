const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stateSchema = new Schema({
  name: String,
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country'
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
  ]
})

const State = mongoose.model('state', stateSchema)

module.exports = State
