const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  item: String,
  expiration: { type: Date, expires: '60s' },
  created: { type: Date }
})

const Feed = mongoose.model('feed', feedSchema)

module.exports = Feed
