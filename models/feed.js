const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  body: {
    item: String,
    date: { type: Date, expires: '7d' }
  }
})

const Feed = mongoose.model('feed', feedSchema)

module.exports = Feed
