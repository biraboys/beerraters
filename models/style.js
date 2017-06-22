const mongoose = require('mongoose')
const Schema = mongoose.Schema

const styleSchema = new Schema({
  name: String,
  color_code: String,
  SRM: String,
  EBC: String,
  ABV: String,
  description: String,
  history: String
})

const Style = mongoose.model('style', styleSchema)

module.exports = Style
