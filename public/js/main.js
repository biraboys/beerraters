const searchForm = document.forms.searchForm
const beerSearch = document.getElementById('beer-search-btn')
const brewerySearch = document.getElementById('brewery-search-btn')
const userSearch = document.getElementById('user-search-btn')
const searchButtonArr = Array.from(document.getElementsByClassName('search-btn'))
const beerContainer = document.getElementById('beer-container')
const resultsContainer = document.getElementById('results-container')
const loadingContainer = document.getElementById('loading-container')

if (sessionStorage.getItem('lastSearch') !== null) {
  const lastSearch = JSON.parse(sessionStorage.getItem('lastSearch'))
  beerContainer.innerHTML = lastSearch
}

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

async function getInputValues (beerName) {
  loadingContainer.classList.add('loading')
  try {
    const response = await fetch(`/search/beers/?q=${beerName}`)
    const beers = await response.json()
    if (beers.length < 1) {
      clearContent(beerContainer)
      displayErrorMessage(beerName)
    } else {
      displayResultCount(beerName, beers.length)
      clearContent(beerContainer)
    }
    beers.forEach(async (beer, index) => {
      if (index <= 50) {
        const beerObj = await getBeerInfo(beer)
        const beerCard = generateBeerCard(beerObj)
        await displayBeer(beerCard)
      }
    })
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
  let styleName, styleLink, breweryName, breweryLink, countryFlag, countryCode, countryLink
  if (beerObj.style) {
    styleName = beerObj.style.name
    styleLink = `/styles/${beerObj.style._id}`
  } else {
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
  sessionStorage.setItem('lastSearch', JSON.stringify(beerContainer.innerHTML))
}

function displayErrorMessage (beerName) {
  const errorMessage = `
    <div class="row">
      <h1 class="hero-heading">Sorry, could not find beer <strong>"${beerName}"</strong></h1>
      <p>Add this beer to our database <a href="/addbeer">here!</a></p>
    </div>
  `
  clearContent(resultsContainer)
  addContent(resultsContainer, errorMessage)
}

function displayResultCount (beerName, resultAmount) {
  let showing
  if (resultAmount > 50) {
    showing = 50
  } else {
    showing = resultAmount
  }
  const resultMessage = `
    <div class="row">
      <h4 class="hero-heading" id="search-results">Results for <strong>"${beerName}"</strong>, showing ${showing} out of ${resultAmount}</h4>       
    </div>
  `
  clearContent(resultsContainer)
  addContent(resultsContainer, resultMessage)
}

function addContent (element, content) {
  element.innerHTML += content
}

function clearContent (element) {
  element.innerHTML = ''
}
