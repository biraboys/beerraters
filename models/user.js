const mongoose = require('mongoose')
const Schema = mongoose.Schema
const titlize = require('mongoose-title-case')
const validate = require('mongoose-validator')
const bcrypt = require('bcrypt')

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-ZåäöÅÄÖ]{3,20})+[ ]+([a-zA-ZåäöÅÄÖ]{3,20})+)+$/,
    message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
]

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Not a valid e-mail.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
  })
]

var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username must contain letters and numbers only.'
  })
]

var passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
    message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
  }),
  validate({
    validator: 'isLength',
    arguments: [8, 35],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
]

const userSchema = new Schema({
  username: { type: String, required: true, lowercase: true, unique: true, validate: usernameValidator },
  name: { type: String, required: true, validate: nameValidator },
  email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
  password: { type: String, required: true, validate: passwordValidator },
  registered: { type: Date, default: Date.now },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'review' }]
})

userSchema.static('findByName', function (name, callback) {
  return this.find({ username: name }, callback)
})

userSchema.pre('save', function (next) {
  if (this.password) {
    var salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
  }
  next()
})

userSchema.plugin(titlize, {
  paths: [ 'name' ]
})

const User = mongoose.model('user', userSchema)

module.exports = User
