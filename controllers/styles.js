const Style = require('../models/style')

module.exports = {
  index: async (req, res, next) => {
    const styles = await Style.find({})
    res.status(200).render('styles', { styles: styles, session: req.session.user })
  },
  getStyle: async (req, res, next) => {
    const { styleId } = req.params
    const style = await Style.findById(styleId)
    res.status(200).render('style', { style: style, session: req.session.user })
  }
}
