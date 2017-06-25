const router = require('express-promise-router')()

router.route('/')
  .post((req, res) => {
    req.session.destroy((err) => {
      res.redirect('/')
      if (req.session === undefined) {
        console.log('logged out')
      }
    })
  })

module.exports = router
