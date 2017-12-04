const router = require('express-promise-router')()
const Feed = require('../models/feed')
const JSONStream = require('JSONStream')

router.get('/', async function (req, res, next) {
  Feed.find().cursor().pipe(JSONStream.stringify()).pipe(res)
})

module.exports = router
