const router = require('express-promise-router')()
const TypesController = require('../controllers/types')

router.route('/')
  .get(TypesController.index)

router.route('/:typeId')
  .get(TypesController.getType)

module.exports = router
