const mongoose = require('mongoose')
const Schema = mongoose.Schema

const typeSchema = new Schema({
  name: String,
  color_code: String,
  SRM: String,
  EBC: String,
  ABV: String,
  description: String,
  history: String
})

const Type = mongoose.model('type', typeSchema)

module.exports = Type
