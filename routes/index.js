const router = require('express-promise-router')()
const Feed = require('../models/feed')

router.get('/', async function (req, res, next) {
  if (req.session.user) {
    const feed = await Feed.find({'user_id': req.session.user._id})
    res.render('index', { session: req.session.user, feed: feed })
  } else {
    res.render('index', { session: req.session.user })
  }
})

module.exports = router
