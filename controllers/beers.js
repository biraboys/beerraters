const Beer = require('../models/beer')
const Category = require('../models/category')
const Brewery = require('../models/brewery')
const Country = require('../models/country')
const Style = require('../models/style')
const User = require('../models/user')
const {sortByName} = require('../helpers/helpers')

module.exports = {
  index: async (req, res, next) => {
    const beers = await Beer.find({})
    res.status(200).json(beers)
  },
  addBeer: async (req, res, next) => {
    if (!req.session.user) {
      res.redirect('/login')
    } else {
      const [countries, styles] = await Promise.all([
        Country.find({}, 'name'),
        Style.find({}, 'name')
      ])

      sortByName(countries)
      sortByName(styles)

      res.render('addbeer', {session: req.session.user, countries: countries, styles: styles})
    }
  },
  newBeer: async (req, res, next) => {
    const [name, style, country, image, description] = [req.body.name, req.body.style, req.body.country, req.body.image, req.body.description]
    const [styleId, countryId] = await Promise.all([
      Style.findOne({name: style}, '_id'),
      Country.findOne({name: country}, '_id')
    ])
    let [category, brewery] = [req.body.category, req.body.brewery]
    if (category === 'Other') {
      category = req.body.otherCategory
      const newCategory = new Category({
        name: category,
        style_id: styleId
      })
      await newCategory.save()
    }
    if (brewery === 'Other') {
      brewery = req.body.otherBrewery
      const newBrewery = new Brewery({
        name: brewery,
        country_id: countryId
      })
      await newBrewery.save()
    }
    const [categoryId, breweryId] = await Promise.all([
      Category.findOne({name: category}, '_id'),
      Brewery.findOne({name: brewery}, '_id')
    ])

    const newBeer = new Beer({
      name: name,
      category_id: categoryId,
      style_id: styleId,
      brewery_id: breweryId,
      country_id: countryId,
      image: image,
      description: description
    })
    const beer = await newBeer.save()
    res.status(201).redirect(`/beers/${beer._id}`)
  },
  getBeer: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId)
    let brewery, country, style, category, rating
    if (beer.brewery_id) {
      brewery = await Brewery.findOne({_id: beer.brewery_id}, 'name')
    }
    if (beer.country_id) {
      country = await Country.findOne({_id: beer.country_id}, 'code flag')
    }
    if (beer.category_id) {
      category = await Category.findById(beer.category_id)
      style = await Style.findOne({_id: category.style_id}, 'name')
    }
    if (beer.avg_rating) {
      rating = beer.avg_rating
    }
    res.json({ beer: beer, brewery: brewery, country: country, style: style, category: category, rating: rating })
  },
  getUserReviews: async (req, res, next) => {
    const { userId } = req.params
    const userReviews = await User.findById(userId).populate('reviews')
    res.status(200).render('reviews', userReviews)
  },
  updateBeer: async (req, res, next) => {
    const { beerId } = req.params
    const [description, styleId] = [req.body.description, req.body.style]
    let category = req.body.category

    if (category === 'Other') {
      category = req.body.otherCategory
      const newCategory = new Category({
        name: category,
        style_id: styleId
      })
      await newCategory.save()
    }

    const categoryId = await Category.findOne({name: category}, '_id')
    await Beer.findByIdAndUpdate(beerId, { $set: { style_id: styleId, category_id: categoryId, description: description } })
    // if (brewery === 'Other') {
    //   brewery = req.body.otherBrewery
    //   const newBrewery = new Brewery({
    //     name: brewery,
    //     country_id: countryId
    //   })
    //   await newBrewery.save()
    // }
    // const [categoryId, breweryId] = await Promise.all([
    //   Category.findOne({name: category}, '_id'),
    //   Brewery.findOne({name: brewery}, '_id')
    // ])
    res.status(200).redirect(`/beers/${beerId}`)
  },
  findBeer: async (req, res, next) => {
    const beerName = req.query.q
    const allBeers = await Beer.find({})
    const beers = await Beer.findByName(allBeers, beerName)
    res.status(200).json(beers)
    // res.status(200).render('beers', { beers: beers, beerName: beerName, session: req.session.user })
    // res.status(200).json(filtered)
  },
  renderBeer: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId)
    let brewery, country, style, category
    if (beer.brewery_id) {
      brewery = await Brewery.findOne({_id: beer.brewery_id}, 'name')
    }
    if (beer.country_id) {
      country = await Country.findOne({_id: beer.country_id}, 'code flag')
    }
    if (beer.category_id) {
      category = await Category.findOne({_id: beer.category_id}, 'name style_id')
    }
    if (beer.style_id) {
      style = await Style.findOne({_id: beer.style_id}, 'name')
    }
    res.status(200).render('beer', { beer: beer, brewery: brewery, country: country, style: style, category: category, session: req.session.user })
  },
  consumeBeer: async (req, res, next) => {
    if (!req.session) {
      res.redirect('/login')
    } else {
      // const sessionId = req.sessionID
      // const sessions = await Session.find({})
      // const match = sessions.filter(mongo => {
      //   if (mongo._id === sessionId) {
      //     return mongo
      //   }
      // })

      // const userId = JSON.parse(match[0].session).user._id
      const userId = req.session.user._id
      const user = await User.findById(userId)

      const { beerId } = req.params
      const beer = await Beer.findById(beerId)
      const beerConsumes = beer.consumes

      const exists = beerConsumes.indexOf(userId)

      if (exists === -1) {
        beer.consumes.push(user)
        await beer.save()
        await User.findOneAndUpdate({ _id: userId }, { $push: { consumes: beerId } })
        res.redirect('/')
      } else {
        res.send('Already consumed, you thirsty bastard!')
      }
    }
  },
  addBeerRating: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId)
    const rating = req.body.rating
    const userId = req.session.user._id
    const user = await User.findById(userId)
    const ratings = user.ratings
    const exists = ratings.indexOf(beerId)

    if (exists === -1) {
      beer.ratings.push({rating: rating, user: user})
      let avgRating = 0
      for (const obj of beer.ratings) {
        avgRating += obj.rating
      }
      avgRating = (avgRating / beer.ratings.length).toFixed(1)
      beer.avg_rating = avgRating
      await beer.save()
      await User.findOneAndUpdate({ _id: userId }, { $push: { ratings: beerId } })
      res.send(`Not Rated`)
    } else {
      res.send('Already Rated')
    }
  },
  getAverageRating: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId)
    if (beer.avg_rating) {
      res.json(beer.avg_rating)
    } else {
      res.json(0)
    }
  },
  getContributions: async (req, res, next) => {
    const { beerId } = req.params
    const userId = req.session.user._id
    const beer = await Beer.findById(beerId, 'consumes ratings reviews')
    res.status(200).json({beer: beer, user: userId})
  }
}
