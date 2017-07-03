const Style = require('../models/style')
const Category = require('../models/category')
const {sortByName} = require('../helpers/helpers')

module.exports = {
  index: async (req, res, next) => {
    const styles = await Style.find({}, 'name')
    sortByName(styles)
    res.json(styles)
  },
  getStyle: async (req, res, next) => {
    const { styleId } = req.params
    const style = await Style.findById(styleId)
    res.status(200).render('style', { style: style, session: req.session.user })
  },
  getCategories: async (req, res, next) => {
    const {styleId} = req.params
    const categories = await Category.find({style_id: styleId}, 'name')
    sortByName(categories)
    res.json(categories)
  }
}
