const Beer = require('../models/beer')
const Category = require('../models/category')
const Brewery = require('../models/brewery')
const Country = require('../models/country')
const Style = require('../models/style')
const {sortByName} = require('../helpers/helpers')

module.exports = {
  index: async (req, res, next) => {
    const beers = await Beer.find({})
    res.status(200).json(beers)
  },
  addBeer: async (req, res, next) => {
    const [countries, categories, styles, breweries] = await Promise.all([
      Country.find({}),
      Category.find({}),
      Style.find({}),
      Brewery.find({})
    ])

    sortByName(countries)
    sortByName(categories)
    sortByName(styles)
    sortByName(breweries)

    if (!req.session.user) {
      res.redirect('/login')
    } else {
      res.render('addbeer', {session: req.session.user, countries: countries, categories: categories, styles: styles, breweries: breweries})
    }
  },
  newBeer: async (req, res, next) => {
    const [name, category, style, brewery, country, image, description] =
      [
        req.body.name, req.body.category, req.body.style, req.body.brewery, req.body.country, req.body.image, req.body.description
      ]

    const [categoryId, styleId, breweryId, countryId] = await Promise.all([
      Category.findOne({name: category}, '_id'),
      Style.findOne({name: style}, '_id'),
      Brewery.findOne({name: brewery}, '_id'),
      Country.findOne({name: country}, '_id')
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
    res.status(201).json(beer)
  },
  getBeerCategory: async (req, res, next) => {
    const { beerId } = req.params
    const beerCategory = await Beer.findById(beerId).populate('category')
    // res.status(200).render('categories', beerCategories)
    res.status(200).json(beerCategory)
  },
  getBeer: async (req, res, next) => {
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
      category = await Category.findById(beer.category_id)
      style = await Style.findOne({_id: category.style_id}, 'name')
    }
    res.json({ beer: beer, brewery: brewery, country: country, style: style, category: category })
  },
  getBeerBrewery: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId)
    const beerBrewery = await Brewery.find({ _id: beer.brewery_id })
    const beerCountry = beerBrewery[0].country
    const ct = countries.filter(country => {
      if (country.name.toLowerCase() === beerCountry.toLowerCase()) {
        return country
      }
    })
    const country = ct[0]
    res.status(200).render('brewery', { brewery: beerBrewery[0], country: country, session: req.session.user })
  },
  //   getUserReviews: async (req, res, next) => {
  //     const { userId } = req.params
  //     const userReviews = await User.findById(userId).populate('reviews')
  //     res.status(200).render('reviews', userReviews)
  //   },
  newBeerCategory: async (req, res, next) => {
    const { beerId } = req.params
    // Create a new category
    const newCategory = new Category(req.body)
    // Get beer
    const beer = await Beer.findById(beerId)
    // Bind category and beer
    newCategory.beer = beer
    // Save category
    await newCategory.save()
    // Add category to beer
    beer.category.push(newCategory)
    // Save cateogry
    await beer.save()

    res.status(201).json(newCategory)
  },
  updateBeer: async (req, res, next) => {
    const { beerId } = req.params
    const updatedBeer = req.body
    const result = await Beer.findByIdAndUpdate(beerId, updatedBeer)
    res.status(200).json({ success: true })
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
    if (beer.style_id) {
      style = await Style.findOne({_id: beer.style_id}, 'name')
    }
    if (beer.category_id) {
      category = await Category.findOne({_id: beer.category_id}, 'name')
    }
    res.status(200).render('beer', { beer: beer, brewery: brewery, country: country, style: style, category: category, session: req.session.user })
  }
}
