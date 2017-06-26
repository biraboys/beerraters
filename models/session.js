const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionSchema = new Schema({
  _id: String,
  expires: Date,
  session: Object
})

const Session = mongoose.model('session', sessionSchema)

module.exports = Session
