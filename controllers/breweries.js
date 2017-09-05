const Brewery = require('../models/brewery')
const State = require('../models/state')
const Country = require('../models/country')

module.exports = {
  index: async (req, res, next) => {
    const breweries = await Brewery.find({})
    res.status(200).json(breweries)
  },
  newBrewery: async (req, res, next) => {
    const newBrewery = new Brewery(req.body)
    const brewery = await newBrewery.save()
    res.status(201).json(brewery)
  },
  getBrewery: async (req, res, next) => {
    const { breweryId } = req.params
    const brewery = await Brewery.findById(breweryId)
    let state
    let country
    if (brewery.state_id) {
      state = await State.findById(brewery.state_id)
    }
    if (brewery.country_id) {
      country = await Country.findById(brewery.country_id)
    }
    res.status(200).json({ brewery: brewery, state: state, country: country, session: req.session.user })
  },
  findBrewery: async(req, res, next) => {
    const breweryName = req.query.q
    const allBreweries = await Brewery.find({})
    const breweries = await Brewery.findByName(allBreweries, breweryName)
    res.status(200).render('breweries', { breweries: breweries, breweryName: breweryName, session: req.session.user })
  }
}
