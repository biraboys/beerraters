// Requires for app
const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
require('dotenv').config()

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const redis = require('socket.io-redis')
io.adapter(redis({ host: 'localhost', port: 6379 }))

// Middleware
app.use(function (req, res, next) {
  res.io = io
  next()
})
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    secure: !true,
    // Cookie last for 2 weeks
    expires: new Date(Date.now() + 12096e5)
  }
}))

app.use(cookieParser())

// Routes
const index = require('./routes/index')
const users = require('./routes/users')
const beers = require('./routes/beers')
const breweries = require('./routes/breweries')
const countries = require('./routes/countries')
const search = require('./routes/search')
const login = require('./routes/login')
const register = require('./routes/register')
const facts = require('./routes/facts')
const logout = require('./routes/logout')
const styles = require('./routes/styles')
const forgot = require('./routes/forgot')
const reset = require('./routes/reset')
const reviews = require('./routes/reviews')
const activation = require('./routes/activation')

app.use('/', index)
app.use('/users', users)
app.use('/beers', beers)
app.use('/search', search)
app.use('/login', login)
app.use('/register', register)
app.use('/breweries', breweries)
app.use('/countries', countries)
app.use('/facts', facts)
app.use('/logout', logout)
app.use('/styles', styles)
app.use('/forgot', forgot)
app.use('/reset', reset)
app.use('/reviews', reviews)
app.use('/activation', activation)

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {}
  const status = err.status || 500

  // Respond to client
  res.status(status).json({
    error: {
      message: error.message
    }
  })

// Respond to self
  console.log(error)
})

// Databse handling
const db = mongoose.connection

const uri = process.env.MONGODB_HOST

const options = {
  user: process.env.MONGODB_U,
  pass: process.env.MONGODB_PASS
}

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected to MongoDB')
})

// Mongoose setup
mongoose.Promise = global.Promise
mongoose.connect(uri, options)

module.exports = { app: app, server: server }
