var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
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
});

// var fluffy = new Kitten({ name: 'fluffy' });

// fluffy.save(function(err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

module.exports = router;
