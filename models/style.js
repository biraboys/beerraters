const mongoose = require('mongoose')
const Schema = mongoose.Schema

const styleSchema = new Schema({
  name: String,
  category_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'category'
  }
})

const Style = mongoose.model('style', styleSchema)

module.exports = Style
