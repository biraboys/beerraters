const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brewerySchema = new Schema({
  name:
  {
    type: String,
    required: true
  },
  state_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'state'
  },
  country_id:
  {
    type: Schema.Types.ObjectId,
    ref: 'country',
    required: true
  }
})

brewerySchema.static('findByName', function (breweryArr, breweryName) {
  breweryArr = breweryArr.filter(brewery => {
    if (brewery.name.toLowerCase().includes(breweryName.toLowerCase())) return brewery
  })
  return breweryArr
})

const Brewery = mongoose.model('brewery', brewerySchema)

module.exports = Brewery
