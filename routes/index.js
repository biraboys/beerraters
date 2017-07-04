const router = require('express-promise-router')()
const fetch = require('node-fetch')
const Category = require('../models/category')
const Country = require('../models/country')
const Style = require('../models/style')
const Brewery = require('../models/brewery')
const Beer = require('../models/beer')
const State = require('../models/state')

router.get('/', function (req, res, next) {
  res.render('index', { session: req.session.user })
})

router.get('/breweries', async function (req, res, next) {
  const breweries = await State.find({})
  res.json(breweries)
})
// router.get('/change', async function (req, res, next) {
//   const beers = await Beer.find({})
//   beers.forEach(async (beer, index) => {
//     if (index > 5000 && index < 6000) {
//     if (beer.category_id) {
//       const category = await Category.findById(beer.category_id)
//       await Beer.findByIdAndUpdate(beer._id, { $set: { style_id: category.style_id}})
//     }
//     }
//   })
//   res.end()
// })

// router.get('/categories', async function (req, res, next) {
//   const categories = await Category.find({})
//   const placeholder = []
//   categories.forEach(category => {
//     if (!category.style_id) {
//       placeholder.push(category)
//     }
//   })
//   res.json(placeholder)
// })

// router.get('/new', async function (req, res, next) {
//   const name = 'Other style'
//   const style = new Style({
//     name: name,
//     color_code: '',
//     SRM: '',
//     EBC: '',
//     ABV: '',
//     description: '',
//     history: ''
//   })
//   await style.save()
//   res.json(style)
// })

// router.get('/push', async function (req, res, next) {
//   const title = 'Steam beer'
//   const style = await Style.findOne({name: title})
//   const wikiTitle = title.replace(/\s/g, '_')
//   const response = await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${wikiTitle}`)
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
