const Country = require('../models/country')
const Brewery = require('../models/brewery')
const State = require('../models/state')
const User = require('../models/user')

module.exports = {
  index: async (req, res, next) => {
    const countries = await Country.find({}, 'name flag beers breweries users')
    res.status(201).json(countries)
  },
  getCountryJson: async (req, res, next) => {
    const { countryId } = req.params
    const country = await Country.findOne({_id: countryId}, 'name')
    res.status(200).json(country)
  },
  getCountry: async (req, res, next) => {
    const { countryId } = req.params
    const country = await Country.findById(countryId)
    const breweriesAmount = country.breweries.length
    const beersAmount = country.beers.length
    const users = await User.find({country_id: countryId})
    res.status(200).render('country', { country: country, breweries: breweriesAmount, beers: beersAmount, users: users.length, session: req.session.user })
  },
  getBreweries: async (req, res, next) => {
    const {countryId} = req.params
    const breweries = await Brewery.find({country_id: countryId}, 'name')
    res.status(200).json(breweries)
  },
  getStates: async (req, res, next) => {
    const {countryId} = req.params
    const states = await State.find({country_id: countryId}, 'name')
    res.status(200).json(states)
  }
}
