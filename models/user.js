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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
    }
  ]
})

userSchema.static('findByName', function (name, callback) {
  return this.find({ firstName: name }, callback)
})

const User = mongoose.model('user', userSchema)

module.exports = User
