const mongoose = require('mongoose')
const passwordPlugin = require('mongoose-password-plugin')
const Schema = mongoose.Schema

const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  registered: {
    type: Date, default: Date.now
  },
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
userSchema.plugin(passwordPlugin)

const User = mongoose.model('user', userSchema)

module.exports = User
