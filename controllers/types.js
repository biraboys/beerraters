const Type = require('../models/type')

module.exports = {
  index: async (req, res, next) => {
    const types = await Type.find({})
    res.status(200).render('types', { types: types, session: req.session.user })
  },
  getType: async (req, res, next) => {
    const { typeId } = req.params
    const type = await Type.findById(typeId)
    res.status(200).render('type', { type: type, session: req.session.user })
  }
}
