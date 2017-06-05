const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const kittySchema = mongoose.Schema({
  name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);


/* GET users listing. */
router.get('/', function(req, res, next) {
  Kitten.find(function(err, kittens) {
    if (err) return console.error(err);
    res.render('users', { kittens });
  });
});

// var fluffy = new Kitten({ name: 'fluffy' });

// fluffy.save(function(err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

// Kitten.find({ name: /^fluff/ }, callback);

module.exports = router;
