const router = require('express-promise-router')()
const breweries = require('../breweries.json')
const beers = require('../beers.json')
const countries = require('../db/countries.json')
const categories = require('../db/categories.json')
const styles = require('../db/styles.json')
const Country = require('../models/country')
const State = require('../models/state')
const Style = require('../models/style')
const Category = require('../models/category')
const Brewery = require('../models/brewery')
const Beer = require('../models/beer')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/db', function (req, res, next) {
  // const newBreweries = breweries.map(brewery => {
  //   brewery.country = 'hej'
  //   // countries.forEach(country => {
  //   //   if (brewery.country === country.name) {
  //   //     return country.id
  //   //   }
  // })
  // res.json(newBreweries)
  const breweryArr = breweries.map(brewery => {
    return {
      id: Number(brewery.id),
      name: brewery.name,
      city: brewery.city,
      country: brewery.country
      // code: country.code3l,
      // flag: country.flag_32,
      // lat: country.latitude,
      // long: country.longitude,
      // zoom: country.zoom
    }
  })
  breweryArr.filter(brewery => {
    if (brewery.country) {
      countries.forEach(country => {
        if (brewery.country === country.name) brewery.country_id = country.id
      })
    }
  })
  res.json(breweryArr)
})

router.get('/push', async function (req, res, next) {

  const mongoBreweries = await Brewery.find({})
  breweries.forEach(brewery => {
    mongoBreweries.forEach(mongoCount => {
      if (brewery.name === mongoCount.name) {
        brewery.mongoId = mongoCount._id
        brewery.country_id = mongoCount.country_id
      }
    })
  })

  beers.forEach(beer => {
    breweries.forEach(brewery => {
      if (beer.brewery_id === brewery.id) {
        beer.brewery_mongoId = brewery.mongoId
        beer.country_id = brewery.country_id
      }
    })
  })

 const mongoStyles = await Style.find({})
  styles.forEach(style => {
    mongoStyles.forEach(mongoCount => {
      if (style.name === mongoCount.name) {
        style.mongoId = mongoCount._id
        style.category_id = mongoCount.category_id
      }
    })
  })

  beers.forEach(beer => {
    styles.forEach(style => {
      if (Number(beer.style_id) === Number(style.id)) {
        beer.style_mongoId = style.mongoId
        beer.category_monogId = style.category_id
      }
    })
  })
  beers.forEach(beer => {
    if (beer.descript !== '') {
      beer.description = beer.descript
       if (beer.add_user !== '0' && isNaN(beer.add_user)) {
      beer.description += beer.add_user
        if (isNaN(beer.last_mod)) {
      beer.description += beer.last_mod
    }
    }
    }
  })

  // beers.forEach(beer => {
  // const newBeer = new Beer({
  //     name: beer.name,
  //     description : beer.description,
  //     category_id: beer.category_mongoId,
  //     style_id: beer.style_mongoId,
  //     brewery_id: beer.brewery_mongoId,
  //     country_id: beer.country_id
  //   })
  //   newBeer.save()
  // })
  // const mongoStates = await State.find({})
  // breweries.forEach(brewery => {
  //   mongoStates.forEach(mongoCount => {
  //     if (brewery.state === mongoCount.name) {
  //       brewery.state_id = mongoCount._id
  //     }
  //   })
  // })

  //   const mongoCountries = await Country.find({})
  // breweries.forEach(brewery => {
  //   mongoCountries.forEach(mongoCount => {
  //     if (brewery.country=== mongoCount.name) {
  //       brewery.country_id = mongoCount._id
  //     }
  //   })
  // })

  // breweries.forEach(brewery => {
  //   if (brewery.state_id || brewery.country_id) {
  //     const newBrewery = new Brewery({
  //       name: brewery.name,
  //       state_id: brewery.state_id,
  //       country_id: brewery.country_id
  //     })
  //     newBrewery.save()
  //   }
  // })

//   let test = []
//   breweries.filter(brewery => {
//       if (brewery.state) {
//         test.push({state: brewery.state, country: brewery.country})
//       }
//   })

//   function compare(a,b) {
//   if (a.state < b.state)
//     return -1;
//   if (a.state > b.state)
//     return 1;
//   return 0;
// }

//   test.sort((compare))

//   const newArr = test.filter((t, index) => {
//     if (index > 0) {
//       if (t.state !== test[index - 1].state) {
//         return t
//       }
//     }
//   })

//   const mongoCountries = await Country.find({})

//   newArr.forEach(obj => {
//     mongoCountries.forEach(mongoCount => {
//       if (obj.country === mongoCount.name) {
//         obj.country_id = mongoCount._id
//       }
//   })
// })

// const finalArr = newArr.filter(obj => {
//   if (obj.country_id) return obj
// })

// finalArr.forEach(obj => {
//   const newState = new State({
//       name: obj.state,
//       country_id: obj.country_id
//     })
//     newState.save()
//   })

//   const mongoStates = await State.find({})
  res.json(beers)
//   styles.forEach(style => {
//  const newStyle = new Style({
//       name: style.name,
//       category_id: style.category_id
//     })
//     newStyle.save()
//   })
  // const styles = await Style.find({})
  // console.log(styles)
  // for (let style of styles) {
  //   const category = await Category.findById(style.category_id)
  // }
//   const styleArr = styles;
//   for (let style of styleArr){
//   const category = await Category.findByName(styleArr[0].categoryName)
//   style.category_id = category[0]._id
// }
// styleArr.forEach(style => {
//   const newStyle = new Style({
//       name: style.name,
//       category_id: style.category_id
//     })
//     newStyle.save()
//     })
// const styles = await Style.find({})

// for (let style of styles) {
//   const category = await Category.findById(style.category_id)
//   category.styles.push(style._id)
//   await category.save()
//   }

// const mongoCategories = await Category.find({})
})

module.exports = router
