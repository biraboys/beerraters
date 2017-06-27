const router = require('express-promise-router')()

router.route('/')
  .post((req, res) => {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ err: 'Internal server error' })
      }
      if (req.session === undefined) {
        res.status(200).json({ msg: 'Successfully logged out!' })
      }
    })
  })

module.exports = router
