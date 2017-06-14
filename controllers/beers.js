const Beer = require('../models/beer')
const Category = require('../models/category')
const Brewery = require('../models/brewery')
const Country = require('../models/country')
const Style = require('../models/style')

module.exports = {
  index: async (req, res, next) => {
    const beers = await Beer.find({})
    res.status(201).json(beers)
    // const beers = await Beer.find({})
    // res.status(200).render('beers', {beers})
  },
  newBeer: async (req, res, next) => {
    const newBeer = new Beer(req.body)
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
    let brewery,
      country,
      style,
      category
    if (beer.brewery_id) {
      brewery = await Brewery.findById(beer.brewery_id)
    }
    if (beer.country_id) {
      country = await Country.findById(brewery.country_id)
    }
    if (beer.style_id) {
      style = await Style.findById(beer.style_id)
      category = await Category.findById(style.category_id)
    }
    res.status(200).render('beer', {beer: beer, brewery: brewery, country: country, style: style, category: category})
    // res.status(200).json(brewery)
  },
  getBeerBrewery: async (req, res, next) => {
    const { beerId } = req.params
    const beer = await Beer.findById(beerId)
    const beerBrewery = await Brewery.find({_id: beer.brewery_id})
    const beerCountry = beerBrewery[0].country
    const ct = countries.filter(country => {
      if (country.name.toLowerCase() === beerCountry.toLowerCase()) {
        return country
      }
    })
    const country = ct[0]
    res.status(200).render('brewery', {brewery: beerBrewery[0], country: country})
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
    res.status(200).json({success: true})
  },
  findBeer: async(req, res, next) => {
    const beerName = req.query.q
    const allBeers = await Beer.find({})
    const beers = await Beer.findByName(allBeers, beerName)
    res.status(200).render('beers', {beers: beers, beerName: beerName})
    // let beer
    // if (beerArr[0] !== undefined) beer = beerArr[0].toObject()
    // res.status(200).json(beer)
  }
}
