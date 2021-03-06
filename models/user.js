const mongoose = require('mongoose')
const Schema = mongoose.Schema
const titlize = require('mongoose-title-case')
const validate = require('mongoose-validator')
const bcrypt = require('bcryptjs')

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Not a valid e-mail.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 40],
    message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
  })
]

const usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 15],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username must contain letters and numbers only.'
  })
]

const passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{8,35}$/,
    message: 'Password needs to have at least one lower case, one uppercase, one number and must be at least 8 characters but no more than 35.'
  }),
  validate({
    validator: 'isLength',
    arguments: [8, 35],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
]

const userSchema = new Schema({
  username: { type: String, required: true, lowercase: true, unique: true, validate: usernameValidator },
  name: { type: String, default: '' },
  email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
  password: { type: String, required: true, validate: passwordValidator },
  registered: { type: Date, default: Date.now },
  reviews: [
    {
      _id: { type: Schema.Types.ObjectId, ref: 'review' },
      body: String,
      place: String,
      beer_id: { type: Schema.Types.ObjectId, ref: 'beer' },
      beer_name: String
    }
  ],
  ratings: [
    {
      beer_id: { type: Schema.Types.ObjectId, ref: 'beer' },
      beer_name: String,
      rating: Number
    }
  ],
  consumes: [
    {
      beer_id: { type: Schema.Types.ObjectId, ref: 'beer' },
      beer_name: String
    }
  ],
  country_id: { type: Schema.Types.ObjectId, ref: 'country' },
  following: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  images: [
    {
      data: Buffer,
      contentType: String,
      beer_id: { type: Schema.Types.ObjectId, ref: 'beer' },
      beer_name: String
    }
  ],
  description: { type: String, default: '' },
  profileImg: { data: Buffer, contentType: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  reactivationToken: { type: String },
  role: { type: String, default: 'User' },
  active: { type: Boolean, required: true, default: false },
  registrationToken: { type: String, required: true },
  registrationTokenExpires: { type: Date, expires: '10s' },
  status: { type: Boolean, default: false }
})
// Hash password
userSchema.pre('save', function (next) {
  if (this.password) {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
  }
  next()
})

userSchema.plugin(titlize, {
  paths: [ 'name' ]
})

const User = mongoose.model('user', userSchema)

module.exports = User
