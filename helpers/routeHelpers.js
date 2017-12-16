const Joi = require('joi')

module.exports = {
  validateParams: (schema, name) => {
    return (req, res, next) => {
      const result = Joi.validate({ param: req['params'][name] }, schema)
      if (result.error) {
        return res.status(400).json(result.error)
      } else {
        if (!req.value) {
          req.value = {}
        }
        if (!req.value['params']) {
          req.value['params'] = {}
        }
        req.value['params'][name] = result.value.param
        next()
      }
    }
  },
  validateBody: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema)
      if (result.error) {
        return res.status(400).json(result.error)
      } else {
        if (!req.value) {
          req.value = {}
        }
        if (!req.value['body']) {
          req.value['body'] = {}
        }
        req.value['body'] = result.value
        next()
      }
    }
  },
  schemas: {
    beerSchema: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      style: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      brewery: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      country: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      otherCategory: Joi.string().min(1).max(24).optional().allow(''),
      otherBrewery: Joi.string().min(1).max(24).optional().allow('')
    }),
    reviewSchema: Joi.object().keys({
      place: Joi.string().required(),
      review: Joi.string().required().max(120)
    }),
    ratingSchema: Joi.object().keys({
      rating: Joi.number().required()
    }),
    idSchema: Joi.object().keys({
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  }
}
