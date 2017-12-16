const Beer = require('../models/beer')
const Category = require('../models/category')
const Brewery = require('../models/brewery')
const Country = require('../models/country')
const Review = require('../models/review')
const Feed = require('../models/feed')
const State = require('../models/state')
const Style = require('../models/style')
const User = require('../models/user')
const { sortByName } = require('../helpers/sort')
const Jimp = require('jimp')
const JSONStream = require('JSONStream')
const nodemailer = require('nodemailer')
module.exports = {
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
    const [name, styleId, countryId, description, otherCategory, otherBrewery] = [req.value.body.name.trim(), req.value.body.style, req.value.body.country, req.value.body.description.trim(), req.value.body.otherCategory.trim(), req.value.body.otherBrewery.trim()]
    let [categoryId, breweryId] = [req.value.body.category, req.value.body.brewery]
    if (otherCategory && otherCategory.length > 0) {
      const pattern = /^[0-9a-fA-F$åäöÅÄÖ]+$/i
      console.log(otherCategory)
      console.log(pattern.test(otherCategory))
      // const newCategory = new Category({
      //   name: otherCategory.trim(),
      //   style_id: styleId
      // })
      // categoryId = newCategory._id
      // await newCategory.save()
    }
    if (otherBrewery && otherBrewery.length > 0) {
      console.log(otherBrewery)
      console.log(otherBrewery.length)
      // const newBrewery = new Brewery({
      //   name: otherBrewery.trim(),
      //   country_id: countryId
      // })
      // breweryId = newBrewery._id
      // await newBrewery.save()
    }
    // const category = await Category.findById(categoryId, 'name')
    // const style = await Style.findById(styleId, 'name')
    // const country = await Country.findById(countryId, 'name')
    // const brewery = await Brewery.findById(breweryId, 'name')

    // const beer = new Beer({
    //   name: name,
    //   description: description,
    //   category_id: categoryId,
    //   category_name: category.name,
    //   style_id: styleId,
    //   style_name: style.name,
    //   brewery_id: breweryId,
    //   brewery_name: brewery.name,
    //   country_id: countryId,
    //   country_name: country.name
    // })
    // await beer.save()
    // const stmpTransport = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.GMAIL_U,
    //     pass: process.env.GMAIL_PASS
    //   }
    // })
    // const mailOptions = {
    //   to: process.env.GMAIL_U,
    //   from: process.env.GMAIL_U,
    //   subject: 'Beer added - Beerraters.com',
    //   text: `New beer added to database: http://localhost:6889/beers/${beer._id}\n\n by user: http://localhost:6889/users/${req.session.user._id}`
    // }
    // await stmpTransport.sendMail(mailOptions, err => {
    //   if (err) { console.log(err) }
    //   res.end()
    // })
    // res.redirect(`/beers/${beer._id}`)
    res.end()
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
    const { beerId } = req.value.params
    const beerReviews = await Beer.findById(beerId, 'reviews')
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
    await Beer.find({
      'name': { '$regex': beerName, '$options': 'i' }
    }, '-v -images')
    .lean()
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res)
  },
  findBeerByStyle: async (req, res, next) => {
    const beerName = req.query.q
    await Beer.find({
      'style_name': { '$regex': beerName, '$options': 'i' }
    }, '-v -images')
    .lean()
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res)
  },
  findBeerByBrewery: async (req, res, next) => {
    const beerName = req.query.q
    await Beer.find({
      'brewery_name': { '$regex': beerName, '$options': 'i' }
    }, '-v -images')
    .lean()
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res)
  },
  findBeerByCountry: async (req, res, next) => {
    const beerName = req.query.q
    await Beer.find({
      'country_name': { '$regex': beerName, '$options': 'i' }
    }, '-v -images')
    .lean()
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res)
  },
  renderBeer: async (req, res, next) => {
    const { beerId } = req.value.params
    const beer = await Beer.findById(beerId).populate('country_id brewery_id style_id category_id images.user_id', '-password')
    res.status(200).render('beer', {beer: beer, session: req.session.user})
  },
  consumeBeer: async (req, res, next) => {
    const userId = req.session.user._id
    const { beerId } = req.value.params

    const beer = await Beer.findById(beerId, 'consumes name')
    const user = await User.findById(userId, 'username')

    if (beer.consumes.includes(userId)) {
      res.status(400).end()
    } else {
      await Beer.findByIdAndUpdate(beerId, { $push: { consumes: user._id } })
      await User.findByIdAndUpdate(user._id, { $push: { consumes: beerId } })
      const newFeed = new Feed({
        user_id: user._id,
        username: user.username,
        type: 'consumed',
        beer_id: beer._id,
        beer_name: beer.name,
        expiration: Date.now() + 604800000,
        created: Date.now()
      })
      await newFeed.save()
      res.io.emit('news', newFeed)
      res.status(201).end()
    }
  },
  addBeerRating: async (req, res, next) => {
    const { beerId } = req.value.params
    const userId = req.session.user._id
    const user = await User.findById(userId, 'username ratings')
    if (user.ratings.includes(beerId)) {
      res.status(400).end()
    } else {
      const rating = req.value.body.rating
      if (typeof rating === 'number') {
        await Beer.findByIdAndUpdate(beerId, { $push: { ratings: {rating: rating, user: userId} } })
        await User.findByIdAndUpdate(userId, { $push: { ratings: beerId } })
        const beer = await Beer.findById(beerId, 'name ratings')
        const beerRatings = beer.ratings.map(obj => {
          return obj.rating
        })
        const ratingSum = beerRatings.reduce((a, b) => a + b, 0)
        const avgRating = ratingSum / beerRatings.length
        avgRating.toFixed(1)
        await Beer.findByIdAndUpdate(beerId, { $set: { avg_rating: avgRating } })
        const newFeed = new Feed({
          user_id: user._id,
          username: user.username,
          type: `rated ${rating}`,
          beer_id: beer._id,
          beer_name: beer.name,
          expiration: Date.now() + 604800000,
          created: Date.now()
        })
        await newFeed.save()
        res.io.emit('news', newFeed)
        res.status(201).end()
      }
    }
  },
  getAverageRating: async (req, res, next) => {
    const { beerId } = req.value.params
    const beer = await Beer.findById(beerId)
    if (beer.avg_rating) {
      res.json(beer.avg_rating.toFixed(1))
    } else {
      res.json(0)
    }
  },
  getContributions: async (req, res, next) => {
    const { beerId } = req.params
    const userId = req.session.user._id
    const beer = await Beer.findById(beerId, 'consumes ratings images reviews')
    res.status(200).json({beer: beer, user_id: userId})
  },
  addBeerImage: async (req, res, next) => {
    const { beerId } = req.params
    const userId = req.session.user._id
    const user = await User.findById(userId, 'username')
    const beer = await Beer.findById(beerId, 'name')
    let postedImageUserIds
    if (beer.images) {
      postedImageUserIds = beer.images.map(imageObj => {
        return imageObj.user_id
      })
    }
    if (postedImageUserIds && postedImageUserIds.includes(userId)) {
      res.status(400).end()
    }
    const image = await Jimp.read(req.file.buffer)
    if (image) {
      image.resize(Jimp.AUTO, 250)
      image.quality(60)
      image.getBuffer('image/png', async function (err, data) {
        if (err) throw err
        await Beer.findByIdAndUpdate(beer._id, { $push: { images: { data: data, contentType: 'image/png', user_id: user._id } } })
        await User.findByIdAndUpdate(user._id, { $push: { images: { data: data, contentType: 'image/png', beer_id: beer._id } } })
        const newFeed = new Feed({
          user_id: user._id,
          username: user.username,
          type: 'uploaded',
          beer_id: beer._id,
          beer_name: beer.name,
          expiration: Date.now() + 604800000,
          created: Date.now()
        })
        await newFeed.save()
        res.io.emit('news', newFeed)
        res.status(201).end()
      })
    } else {
      res.status(406).end()
    }
  },
  addBeerReview: async (req, res, next) => {
    const userId = req.session.user._id
    const user = await User.findById(userId, 'username')
    const { beerId } = req.value.params
    const beer = await Beer.findById(beerId, 'reviews name')
    if (beer.reviews.includes(userId)) {
      res.status(400).end()
    }
    const review = new Review({
      user_id: user._id,
      place: req.value.body.place.trim(),
      body: req.value.body.review.trim(),
      beer_id: beer._id
    })
    await review.save()
    await Beer.findByIdAndUpdate(beerId, { $push: { reviews: { review_id: review._id, user_id: userId } } })
    await User.findByIdAndUpdate(userId, { $push: { reviews: review._id } })
    const newFeed = new Feed({
      user_id: user._id,
      username: user.username,
      type: 'reviewed',
      beer_id: beer._id,
      beer_name: beer.name,
      expiration: Date.now() + 604800000,
      created: Date.now()
    })
    await newFeed.save()
    res.io.emit('news', newFeed)
    res.status(201).json(review)
  },
  getBeerImage: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId, 'images')
    if (beer.images.length > 0) {
      res.contentType(beer.images[0].contentType)
      res.send(beer.images[0].data)
    } else {
      res.end()
    }
  },
  getBeerImages: async (req, res, next) => {
    const { beerId } = req.params
    const imageIndex = req.body.index
    const beer = await Beer.findById(beerId)
    const user = await User.findById(beer.images[imageIndex].user_id, 'username')
    res.set({
      'User-Name': user.username,
      'Content-Type': beer.images[imageIndex].contentType
    })
    res.send(beer.images[imageIndex].data)
  }
}
