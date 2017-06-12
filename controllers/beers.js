const Beer = require('../models/beer')
const Category = require('../models/category')
const Brewery = require('../models/brewery')
const json = require('../beers.json')

module.exports = {
  index: async (req, res, next) => {
    const firstBeer = {
      name: json.beers[0].name,
      brewery_id: Number(json.beers[0].brewery_id),
      // category: json.beers[0].cat_id,
      // style: json.beers[0].style_id,
      description: json.beers[0].descript
    }
    const newBeer = new Beer(firstBeer)
    const beer = await newBeer.save()
    res.status(201).json(beer)
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
    const brewery = await Brewery.findById(beer.brewery_id)
    // console.log(brewery)
    // res.status(200).render('beer', {beer})
    res.status(200).json(brewery)
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
    const beerArr = await Beer.findByName(beerName)
    let beer
    if (beerArr[0] !== undefined) beer = beerArr[0].toObject()
    // res.status(200).render('user', {beer})
    res.status(200).json(beer)
  }
}
