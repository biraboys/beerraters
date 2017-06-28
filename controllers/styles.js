const Style = require('../models/style')
const Category = require('../models/category')
const {sortByName} = require('../helpers/helpers')

module.exports = {
  index: async (req, res, next) => {
    const styles = await Style.find({})
    sortByName(styles)
    res.status(200).render('styles', { styles: styles, session: req.session.user })
  },
  getStyle: async (req, res, next) => {
    const { styleId } = req.params
    const style = await Style.findById(styleId)
    res.status(200).render('style', { style: style, session: req.session.user })
  },
  getCategories: async (req, res, next) => {
    const {styleName} = req.params
    const styleId = await Style.findOne({name: styleName}, '_id')
    const categories = await Category.find({style_id: styleId}, 'name')
    res.json(categories)
  }
}
