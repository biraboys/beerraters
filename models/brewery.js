const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brewerySchema = new Schema({
  name: String,
  state_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'state'
  },
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country'
  }
})

brewerySchema.static('findByName', function (breweryArr, breweryName) {
  breweryArr = breweryArr.filter(brewery => {
    if (brewery.name.includes(breweryName)) return brewery
  })
  return breweryArr
})

const Brewery = mongoose.model('brewery', brewerySchema)

module.exports = Brewery
