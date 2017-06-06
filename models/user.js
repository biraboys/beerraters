const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: String,
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

const User = mongoose.model('user', userSchema)

module.exports = User

// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   Kitten.find(function (err, kittens) {
//     if (err) return console.error(err)
//     res.render('users', { kittens })
//   })
// })

// var fluffy = new Kitten({ name: 'fluffy' });

// fluffy.save(function(err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

// Kitten.find({ name: /^fluff/ }, callback)
