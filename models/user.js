const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  email: String,
  password: String,
  role: Boolean,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
    }
  ]
})

const User = mongoose.model('user', userSchema)

module.exports = User
