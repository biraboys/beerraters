const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  username: { type: String, required: true },
  type: { type: String, required: true },
  beer_id: {
    type: Schema.Types.ObjectId,
    ref: 'beer',
    required: true
  },
  beer_name: { type: String, required: true },
  expiration: { type: Date, expires: '60s' },
  created: { type: Date }
})

const Feed = mongoose.model('feed', feedSchema)

module.exports = Feed
