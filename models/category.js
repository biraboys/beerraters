const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name:
  {
    type: String,
    required: true,
    unique: true
  },
  style_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'style',
    required: true
  }
})

categorySchema.static('findByName', function (categoryName, callback) {
  return this.find({ name: categoryName }, callback)
})

const Category = mongoose.model('category', categorySchema)

module.exports = Category
