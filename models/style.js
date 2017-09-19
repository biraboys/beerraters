const mongoose = require('mongoose')
const Schema = mongoose.Schema

const styleSchema = new Schema({
  name:
  {
    type: String,
    required: true,
    unique: true
  },
  color_code:
  {
    type: String,
    required: true
  },
  SRM:
  {
    type: String,
    required: true
  },
  EBC:
  {
    type: String,
    required: true
  },
  ABV:
  {
    type: String,
    required: true
  },
  description:
  {
    type: String,
    required: true
  },
  history:
  {
    type: String,
    required: true
  }
})

const Style = mongoose.model('style', styleSchema)

module.exports = Style
