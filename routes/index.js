const router = require('express-promise-router')()
const fetch = require('node-fetch')
const Category = require('../models/category')
const Style = require('../models/style')

router.get('/', function (req, res, next) {
  res.render('index', { session: req.session.user })
})

router.get('/change', async function (req, res, next) {
  const categories = await Category.find({})
  const styles = await Style.find({})
  categories.forEach(async category => {
    if (category.name.toLowerCase().includes('dortmunder export')) {
      styles.forEach(async style => {
        if (style.name.toLowerCase() === 'dortmunder export') {
          category.style_id = style._id
          await category.save()
        }
      })
    }
  })
  res.end()
})

router.get('/categories', async function (req, res, next) {
  const categories = await Category.find({})
  const placeholder = []
  categories.forEach(category => {
    if (!category.style_id) {
      placeholder.push(category)
    }
  })
  res.json(placeholder)
})

// router.get('/push', async function (req, res, next) {
//   const title = 'Dortmunder Export'
//   const style = await Style.findOne({name: title})
//   const wikiTitle = title.replace(/\s/g, '%20')
//   const response = await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Dortmunder_Export`)
//   const parse = await response.json()
//   if (parse.query) {
//     const data = parse.query.pages
//     const extract = data[Object.keys(data)[0]].extract
//     if (extract !== undefined) {
//       const clean = extract.replace(/ *\([^)]*\) */g, ' ').replace(/\n/g, ' ').replace(/\s(?=,)[\s,\s]/g, '')
//       style.description = clean
//       await style.save()
//       res.json(style.description)
//     }
//   }
// })

module.exports = router
