var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongouser = require('./user.js');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

//Mongoose setup
var connection = mongoose.connect(`mongodb://${mongouser.user}:${mongouser.pass}@cluster0-shard-00-00-h3zej.mongodb.net:27017,cluster0-shard-00-01-h3zej.mongodb.net:27017,cluster0-shard-00-02-h3zej.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
  console.log('Connected to DataBase!');
});

var kittySchema = mongoose.Schema({
    name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);

// var jazz = new Kitten({ name: 'jazz' });

// jazz.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   console.log('it worked!');
// });

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
