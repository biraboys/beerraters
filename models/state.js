const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stateSchema = new Schema({
  name:
  {
    type: String,
    required: true,
    unique: true
  },
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country',
    required: true
  }
})

const State = mongoose.model('state', stateSchema)

module.exports = State
