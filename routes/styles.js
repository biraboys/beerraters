const router = require('express-promise-router')()
const StylesController = require('../controllers/styles')

router.route('/')
  .get(StylesController.index)

router.route('/:styleId')
  .get(StylesController.getStyle)

module.exports = router
