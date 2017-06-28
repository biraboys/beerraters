const Country = require('../models/country')
const Brewery = require('../models/brewery')

module.exports = {
  index: async (req, res, next) => {
    const countries = await Country.find({})
    res.status(201).json(countries)
  },
  getCountry: async (req, res, next) => {
    const { countryId } = req.params
    const country = await Country.findById(countryId)
    const breweriesAmount = country.breweries.length
    const beersAmount = country.beers.length
    res.status(200).render('country', { country: country, breweries: breweriesAmount, beers: beersAmount, session: req.session.user })
  },
  getBreweries: async (req, res, next) => {
    const {countryName} = req.params
    const countryId = await Country.findOne({name: countryName}, '_id')
    const breweries = await Brewery.find({country_id: countryId})
    res.json(breweries)
  }
}
