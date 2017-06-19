const Country = require('../models/country')

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
  }
}
