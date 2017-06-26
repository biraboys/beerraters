// Globals
const searchForm = document.forms.searchForm
const beerSearch = document.getElementById('beer-search-btn')
const brewerySearch = document.getElementById('brewery-search-btn')
const userSearch = document.getElementById('user-search-btn')
const searchButtonArr = Array.from(document.getElementsByClassName('search-btn'))
const beerContainer = document.getElementById('beer-container')
const resultsContainer = document.getElementById('results-container')
const loadingContainer = document.getElementById('loading-container')
const pageNavigation = document.getElementById('page-navigation')

// Storage check
if (sessionStorage.getItem('beerCards') !== null) {
  const beerCards = JSON.parse(sessionStorage.getItem('beerCards'))
  const resultMessage = JSON.parse(sessionStorage.getItem('resultMessage'))
  const navigationButtons = JSON.parse(sessionStorage.getItem('navigationButtons'))
  const beersJSON = JSON.parse(sessionStorage.getItem('beersJSON'))
  resultsContainer.innerHTML = resultMessage
  beerContainer.innerHTML = beerCards
  pageNavigation.innerHTML = navigationButtons
}

// Search buttons and form
function activeButtons (current) {
  current.classList.add('button-primary')
  searchButtonArr.forEach(button => {
    if (button.classList.contains('button-primary') && button !== current) {
      button.classList.remove('button-primary')
    }
  })
}

beerSearch.addEventListener('click', function () {
  searchForm.action = '/search/beers'
  activeButtons(this)
})

brewerySearch.addEventListener('click', function () {
  searchForm.action = '/search/breweries'
  activeButtons(this)
})
userSearch.addEventListener('click', function () {
  searchForm.action = '/search/users'
  activeButtons(this)
})

searchForm.q.addEventListener('keyup', function () {
  const errorContainer = document.getElementById('error-container')
  if (this.value.length < 3) {
    errorContainer.innerHTML = 'Search needs to be at least three characters long'
  } else {
    errorContainer.innerHTML = ''
  }
})

searchForm.addEventListener('submit', function (e) {
  const beerName = searchForm.q.value
  e.preventDefault()
  if (beerName.length >= 3) {
    getInputValues(beerName)
  }
})

// DB calls
async function getInputValues (beerName) {
  loadingContainer.classList.add('loading')
  try {
    const response = await fetch(`/search/beers/?q=${beerName}`)
    const beers = await response.json()
    if (beers.length < 1) {
      clearContent(beerContainer)
      displayErrorMessage(beerName)
    } else {
      const startValue = 1
      let endValue
      if (beers.length > 50) {
        endValue = 50
      } else {
        endValue = beers.length
      }
      displayResultCount(beerName, beers.length, startValue, endValue)
      clearContent(beerContainer)
      sessionStorage.setItem('beersJSON', JSON.stringify(beers))
      beers.forEach(async (beer, index) => {
        if (index <= 50) {
          const beerObj = await getBeerInfo(beer)
          const beerCard = generateBeerCard(beerObj)
          await displayBeer(beerCard)
        }
      })
      if (beers.length > 50) {
        addNextButton(beers.length, beers)
      }
    }
  } catch (e) {
    console.log(e)
  }
  loadingContainer.classList.remove('loading')
}

async function getBeerInfo (beer) {
  try {
    const response = await fetch(`/beers/fetch/${beer._id}`)
    const json = await response.json()
    return json
  } catch (e) {
    console.log(e)
  }
}

function generateBeerCard (beerObj) {
  let categoryName, styleName, styleLink, breweryName, breweryLink, countryFlag, countryCode, countryLink
  if (beerObj.category) {
    categoryName = beerObj.category.name
    styleName = beerObj.style.name
    styleLink = `/styles/${beerObj.style._id}`
  } else {
    categoryName = ''
    styleName = ''
    styleLink = '#'
  }
  if (beerObj.brewery) {
    breweryName = beerObj.brewery.name
    breweryLink = `/breweries/${beerObj.brewery._id}`
  } else {
    breweryName = ''
    breweryLink = '#'
  }
  if (beerObj.country) {
    const img = document.createElement('img')
    img.src = `/images/flags/${beerObj.country.flag}`
    countryFlag = img.outerHTML
    countryCode = beerObj.country.code
    countryLink = `/countries/${beerObj.country._id}`
  } else {
    [countryFlag, countryCode] = ['', '']
    countryLink = '#'
  }
  const beerCard = `
    <div class="row" style="padding: 0.5rem;">
      <div class="card">
        <div class="row">
          <div class="one-half column">
            <div class="card-image">
              <img class="u-max-full-width" src="/images/search-beer.jpg">
            </div>
          </div>
          <div class="one-half column">
            <div class="card-header">
              <div class="card-title">
                <a class="card-link" href="/beers/${beerObj.beer._id}">${beerObj.beer.name}</a>
              </div> 
              <div class="card-title">
                <i class="material-icons md-18 va-middle">star</i>
                <i class="material-icons md-18 va-middle">star</i>
                <i class="material-icons md-18 va-middle">star</i>
                <i class="material-icons md-18 va-middle">star_half</i>
                <i class="material-icons md-18 grey va-middle">star</i>                    
                <span class="va-middle">4.6</span>
              </div>
              <div class="card-subtitle">
               <a class="card-link">${categoryName}</a>
               <a class="card-link" href="${styleLink}">${styleName}</a>
              </div>
              <div class="card-subtitle">
               <a class="card-link" href="${breweryLink}">${breweryName}</a>
              </div>
              <div class="card-subtitle">
               <a class="card-link" href="${countryLink}">${countryCode}</a>   
                ${countryFlag}
              </div>
            </div>
          </div>
        </div>
      `
  return beerCard
}

function displayBeer (beerCard) {
  addContent(beerContainer, beerCard)
  sessionStorage.setItem('beerCards', JSON.stringify(beerContainer.innerHTML))
}

function displayErrorMessage (beerName) {
  const errorMessage = `
    <div class="row">
      <h1 class="hero-heading">Sorry, could not find beer <strong>"${beerName}"</strong></h1>
      <p>Add this beer to our database <a href="/beers/add">here!</a></p>
    </div>
  `
  clearContent(resultsContainer)
  addContent(resultsContainer, errorMessage)
}

function displayResultCount (beerName, resultAmount, startValue, endValue) {
  const resultMessage = `
    <div class="row">
      <h4 class="hero-heading" id="search-results">Results for <strong>"${beerName}"</strong>, showing <span id="start-value">${startValue}</span> - <span id="end-value">${endValue}</span> out of ${resultAmount}</h4>       
    </div>
  `
  clearContent(resultsContainer)
  addContent(resultsContainer, resultMessage)
  sessionStorage.setItem('resultMessage', JSON.stringify(resultsContainer.innerHTML))
}

function addContent (element, content) {
  element.innerHTML += content
}

function clearContent (element) {
  element.innerHTML = ''
}

function addNextButton (beersAmount, beers) {
  clearContent(pageNavigation)
  const button = generateButton('next')
  addContent(pageNavigation, button)

  const nextBtn = document.getElementById('next-btn')
  nextBtn.addEventListener('click', () => {
    generateButtons(beersAmount, beers)
  })
}

function generateButtons (beersAmount, beers) {
  let startValue = Number(document.getElementById('start-value').innerHTML)
  let endValue = Number(document.getElementById('end-value').innerHTML)

  clearContent(pageNavigation)
  endValue += 50

  if (endValue > beersAmount) {
    startValue = 50
    endValue = beersAmount
    newBeerCards(beersAmount, beers, startValue, endValue)
    const button = generateButton('back')
    addContent(pageNavigation, button)
    const calculation = buttonCalculations('back', startValue, endValue, beersAmount)
    const prevBtn = document.getElementById('prev-btn')
    prevBtn.addEventListener('click', () => {
      startValue = calculation.startValue
      endValue = calculation.endValue
      newBeerCards(beersAmount, beers, startValue, endValue)
      clearContent(pageNavigation)
      const button = generateButton('next')
      addContent(pageNavigation, button)
      const nextBtn = document.getElementById('next-btn')
      nextBtn.addEventListener('click', () => {
        generateButtons(beersAmount, beers)
      })
    })
  } else {
    startValue = 51
    endValue = 100
    newBeerCards(beersAmount, beers, startValue, endValue)
    generateOtherButtons(beersAmount, beers)
  }
  sessionStorage.setItem('navigationButtons', JSON.stringify(pageNavigation.innerHTML))
}

function generateOtherButtons (beersAmount, beers) {
  let startValue = Number(document.getElementById('start-value').innerHTML)
  let endValue = Number(document.getElementById('end-value').innerHTML)
  let button
  clearContent(pageNavigation)
  if (startValue !== 1) {
    let button = generateButton('back')
    addContent(pageNavigation, button)
  }
  if (endValue !== beersAmount) {
    button = generateButton('next')
    addContent(pageNavigation, button)
  }
  const prevBtn = document.getElementById('prev-btn')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const calculation = buttonCalculations('back', startValue, endValue, beersAmount)
      startValue = calculation.startValue
      endValue = calculation.endValue
      newBeerCards(beersAmount, beers, startValue, endValue)
      generateOtherButtons(beersAmount, beers)
    })
  }
  const nextBtn = document.getElementById('next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const calculation = buttonCalculations('next', startValue, endValue, beersAmount)
      startValue = calculation.startValue
      endValue = calculation.endValue
      newBeerCards(beersAmount, beers, startValue, endValue)
      generateOtherButtons(beersAmount, beers)
    })
  }
  sessionStorage.setItem('navigationButtons', JSON.stringify(pageNavigation.innerHTML))
}

function buttonCalculations (direction, startValue, endValue, beersAmount) {
  if (direction === 'next') {
    startValue += 50
    endValue += 50
    if (endValue > beersAmount) {
      endValue = beersAmount
    }
  } else {
    endValue -= 50
    if (endValue < 50) {
      endValue = 50
    }
    startValue -= 50
    if (startValue < 1) {
      startValue = 1
    }
  }
  return {
    endValue: endValue,
    startValue: startValue
  }
}

async function newBeerCards (beersAmount, beers, startValue, endValue) {
  const currentBeers = beers.slice(startValue, endValue)
  displayResultCount(searchForm.q.value, beersAmount, startValue, endValue)
  clearContent(beerContainer)
  await currentBeers.forEach(async beer => {
    const beerObj = await getBeerInfo(beer)
    const beerCard = generateBeerCard(beerObj)
    await displayBeer(beerCard)
  })
  window.scrollTo(0, 50)
}

function generateButton (direction) {
  let button
  if (direction === 'back') {
    button = `<a class="button" id="prev-btn">Previous</button>`
  } else {
    button = `<a class="button u-pull-right" id="next-btn">Next</button>`
  }
  return button
}
