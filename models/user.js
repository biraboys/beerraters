const mongoose = require('mongoose')
const Schema = mongoose.Schema
const titlize = require('mongoose-title-case')
const validate = require('mongoose-validator')
const bcrypt = require('bcryptjs')

// const nameValidator = [
//   validate({
//     validator: 'matches',
//     arguments: /^(([a-zA-ZåäöÅÄÖ]{3,20})+[ ]+([a-zA-ZåäöÅÄÖ]{3,20})+)+$/,
//     message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
//   }),
//   validate({
//     validator: 'isLength',
//     arguments: [2, 20],
//     message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
//   })
// ]

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
    arguments: [3, 25],
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
  name: { type: String },
  email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
  password: { type: String, required: true, validate: passwordValidator },
  registered: { type: Date, default: Date.now },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'review' }],
  ratings: [{ type: Schema.Types.ObjectId, ref: 'beer' }],
  consumes: [{ type: Schema.Types.ObjectId, ref: 'beer' }],
  country_id: { type: Schema.Types.ObjectId, ref: 'country' },
  following: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  feed: [
    {
      item: String,
      date: Date
    }
  ],
  images: [
    {
      data: Buffer,
      contentType: String,
      beer_id: { type: Schema.Types.ObjectId, ref: 'beer' }
    }
  ],
  description: { type: String, default: '' },
  profileImg: { data: Buffer, contentType: String },
  resetPasswordToken: { type: String, default: '' },
  resetPasswordExpires: { type: Date, default: null },
  role: { type: String, default: 'User' },
  active: { type: Boolean, required: true, default: false },
  registrationToken: { type: String, required: true },
  registrationTokenExpires: { type: Date, expires: '10s' },
  status: { type: Boolean, default: false }
})

userSchema.static('findByName', function (userArr, userName) {
  userName.toLowerCase()
  userArr = userArr.filter(user => {
    if (user.active === true) {
      if (user.username.toLowerCase().includes(userName) || user.name.toLowerCase().includes(userName)) {
        return user
      }
    }
  })
  return userArr
})

// Hash password
userSchema.pre('save', function (next) {
  if (this.password) {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
  }
  next()
})

// // Remove user.id from all other docs
// userSchema.pre('remove', function (next) {
//   this.model('user').update({
//     followers: this._id,
//     following: this._id
//   }, {
//     $pull: {
//       followers: this._id,
//       following: this._id
//     }}, {
//       multi: true
//     }, next)
// })
// Remove all the assignment docs that reference the removed person.
// userSchema.pre('remove', function (next) {
//   this.model('user').update({
//     $pull: {
//       followers: this._id,
//       following: this._id
//     }
//   }, next)
// })

// Titlize name
userSchema.plugin(titlize, {
  paths: [ 'name' ]
})

const User = mongoose.model('user', userSchema)

module.exports = User
