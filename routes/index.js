const router = require('express-promise-router')()
const Type = require('../models/type')
const fetch = require('node-fetch')

router.get('/', function (req, res, next) {
  res.render('index', { session: req.session.user })
})

// router.get('/push', async function (req, res, next) {
//   const title = 'Foreign Stout'
//   const type = await Type.findOne({name: title})
//   const wikiTitle = title.replace(/\s/g, '%20')
//   const response = await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${wikiTitle}`)
//   const parse = await response.json()
//   if (parse.query) {
//     const data = parse.query.pages
//     const extract = data[Object.keys(data)[0]].extract
//     if (extract !== undefined) {
//       const clean = extract.replace(/ *\([^)]*\) */g, ' ').replace(/\n/g, ' ').replace(/\s(?=,)[\s,\s]/g, '')
//       type.description = clean
//       await type.save()
//       res.json(type.description)
//     }
//   }
// })

module.exports = router
