const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

// Middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
const index = require('./routes/index')
const users = require('./routes/users')
const login = require('./login')
app.use('/', index)
app.use('/users', users)

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

// Start server
const port = app.get('port') || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}`))

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Databse handling
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected to MongoDB')
})

// Mongoose setup
mongoose.Promise = global.Promise
mongoose.connect(
  `mongodb://${login.name}:${login.pass}@cluster0-shard-00-00-h3zej.mongodb.net:27017,cluster0-shard-00-01-h3zej.mongodb.net:27017,cluster0-shard-00-02-h3zej.mongodb.net:27017/beerarino?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`
)

module.exports = app
