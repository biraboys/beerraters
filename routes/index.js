const router = require('express-promise-router')()
const Beer = require('../models/beer')
const fetch = require('node-fetch')

router.get('/', function (req, res, next) {
  res.render('index', { session: req.session.user })
})

// router.get('/push', async function (req, res, next) {
//   const title = 'Stella Artois'
//   const beer = await Beer.findOne({name: title})
//   const wikiTitle = title.replace(/\s/g, '%20')
//   const response = await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${wikiTitle}`)
//   const parse = await response.json()
//   if (parse.query) {
//     const data = parse.query.pages
//     const extract = data[Object.keys(data)[0]].extract
//     if (extract !== undefined) {
//       const clean = extract.replace(/ *\([^)]*\) */g, ' ').replace(/\n/g, ' ').replace(/\s(?=,)[\s,\s]/g, '')
//       beer.description = clean
//       await beer.save()
//       res.end()
//     }
//   }
// })

module.exports = router
