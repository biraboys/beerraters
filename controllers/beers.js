const Beer = require('../models/beer')
const Category = require('../models/category')
const Brewery = require('../models/brewery')
const Country = require('../models/country')
const Review = require('../models/review')
const State = require('../models/state')
const Style = require('../models/style')
const User = require('../models/user')
const Jimp = require('jimp')
const sizeOf = require('image-size')
const fs = require('fs')

module.exports = {
  index: async (req, res, next) => {
    const beers = await Beer.find({})
    res.status(200).json(beers)
  },
  getTopRatedBeers: async (req, res, next) => {
    const beers = await Beer.find({}).populate('style_id country_id', 'name code flag')
    const rated = await Beer.findTopRated(beers)
    res.status(200).json(rated)
  },
  addBeer: async (req, res, next) => {
    if (!req.session.user) {
      res.redirect('/login')
    } else {
      const [countries, styles] = await Promise.all([
        Country.find({}, 'name'),
        Style.find({}, 'name')
      ])

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
  getReviews: async (req, res, next) => {
    const { beerId } = req.params
    const beerReviews = await Beer.findOne({ _id: beerId }, 'reviews')
    res.status(200).json(beerReviews)
  },
  updateBeer: async (req, res, next) => {
    const { beerId } = req.params
    const [description, styleId, countryId] = [req.body.description, req.body.style, req.body.country]
    let [category, brewery, state] = [req.body.category, req.body.brewery, req.body.state]

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
      const breweryId = await Brewery.findOne({name: brewery}, '_id')
      await Country.findByIdAndUpdate(countryId, { $push: {breweries: breweryId} })
      if (state === 'Other') {
        state = req.body.otherState
        const newState = new State({
          name: state,
          country_id: countryId
        })
        await newState.save()
        const stateId = await State.findOne({name: state}, '_id')
        await Brewery.findByIdAndUpdate(breweryId, { $set: {state_id: stateId} })
      }
    }

    const categoryId = await Category.findOne({name: category}, '_id')
    const breweryId = await Brewery.findOne({name: brewery}, '_id')
    await Beer.findByIdAndUpdate(beerId, { $set: { style_id: styleId, category_id: categoryId, description: description, country_id: countryId, brewery_id: breweryId } })

    res.status(200).redirect(`/beers/${beerId}`)
  },
  findBeerByName: async (req, res, next) => {
    const beerName = req.query.q
    const allBeers = await Beer.find({})
    const beers = await Beer.findByName(allBeers, beerName)
    res.status(200).json(beers)
  },
  findBeerByStyle: async (req, res, next) => {
    const beerName = req.query.q
    const allBeers = await Beer.find({}).populate('style_id')
    const beers = await Beer.findByStyle(allBeers, beerName)
    res.status(200).json(beers)
  },
  findBeerByBrewery: async (req, res, next) => {
    const beerName = req.query.q
    const allBeers = await Beer.find({}).populate('brewery_id')
    const beers = await Beer.findByBrewery(allBeers, beerName)
    res.status(200).json(beers)
  },
  findBeerByCountry: async (req, res, next) => {
    const beerName = req.query.q
    const allBeers = await Beer.find({}).populate('country_id')
    const beers = await Beer.findByCountry(allBeers, beerName)
    res.status(200).json(beers)
  },
  renderBeer: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId).populate('country_id brewery_id style_id category_id images.user_id', '-password')
    res.status(200).render('beer', {beer: beer, session: req.session.user})
  },
  consumeBeer: async (req, res, next) => {
    const userId = req.session.user._id

    const { beerId } = req.params
    const beer = await Beer.findOne({_id: beerId}, 'consumes')

    if (beer.consumes.indexOf(userId) === -1) {
      await Beer.findOneAndUpdate({ _id: beerId }, { $push: { consumes: userId } })
      await User.findOneAndUpdate({ _id: userId }, { $push: { consumes: beerId } })
      res.redirect(`/beers/${beerId}`)
    } else {
      res.send('Already consumed, you thirsty bastard!')
    }
  },
  addBeerRating: async (req, res, next) => {
    const { beerId } = req.params
    const userId = req.session.user._id
    const user = await User.findOne({_id: userId}, 'ratings')

    if (user.ratings.indexOf(beerId) === -1) {
      const rating = req.body.rating

      await Beer.findByIdAndUpdate(beerId, { $push: { ratings: {rating: rating, user: userId} } })
      await User.findByIdAndUpdate(userId, { $push: { ratings: beerId } })

      const beer = await Beer.findOne({_id: beerId}, 'ratings')

      const beerRatings = beer.ratings.map(obj => {
        return obj.rating
      })
      const ratingSum = beerRatings.reduce((a, b) => a + b, 0)
      const avgRating = ratingSum / beerRatings.length
      avgRating.toFixed(1)

      await Beer.findByIdAndUpdate(beerId, { $set: { avg_rating: avgRating } })

      res.redirect(`/beers/${beerId}`)
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
    const beer = await Beer.findOne({_id: beerId}, 'consumes ratings images reviews')
    res.status(200).json({beer: beer, user: userId})
  },
  addBeerImage: async (req, res, next) => {
    const {beerId} = req.params
    const path = `public/uploads/beers`
    const name = `${req.files[0].filename}`
    const dimensions = sizeOf(`${path}/${name}`)
    const image = await Jimp.read(`${path}/${name}`)
    if (dimensions.width > dimensions.height) {
      image.resize(Jimp.AUTO, 250)
    } else {
      image.resize(250, Jimp.AUTO)
    }
    image.quality(60)
    image.write(`${path}/${beerId}/${name}.png`)
    await Beer.findByIdAndUpdate(beerId, { $push: { images: { name: `${name}.png`, user_id: req.session.user } } })
    await User.findByIdAndUpdate(req.session.user, { $push: { images: { name: `${name}.png`, beer_id: beerId } } })
    const filePath = `${path}/${name}`
    fs.unlinkSync(filePath)
    res.redirect(`/beers/${beerId}`)
  },
  addBeerReview: async (req, res, next) => {
    const userId = req.session.user._id
    const { beerId } = req.params
    const beer = await Beer.findOne({_id: beerId}, 'reviews')

    if (beer.reviews.indexOf(userId) === -1) {
      const newReview = new Review({
        user_id: userId,
        place: req.body.place,
        country_id: req.body.location,
        body: req.body.review,
        beer_id: beerId
      })
      await newReview.save()
      const review = await Review.findOne({beer_id: beerId, user_id: userId}, '_id')
      await Beer.findOneAndUpdate({ _id: beerId }, { $push: { reviews: { review_id: review._id, user_id: userId } } })
      await User.findOneAndUpdate({ _id: userId }, { $push: { reviews: review._id } })
      res.redirect(`/beers/${beerId}`)
    } else {
      res.send('Already reviwed')
    }
  }
}
