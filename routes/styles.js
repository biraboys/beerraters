const router = require('express-promise-router')()
const StylesController = require('../controllers/styles')

const { validateParams, schemas } = require('../helpers/routeHelpers')

router.route('/')
  .get(StylesController.index)

router.route('/:styleId')
  .get(validateParams(schemas.idSchema, 'styleId'), StylesController.getStyle)

router.route('/:styleId/categories')
  .get(validateParams(schemas.idSchema, 'styleId'), StylesController.getCategories)

module.exports = router
