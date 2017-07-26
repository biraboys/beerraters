// Globals
const searchForm = document.forms.searchForm
const beerSearch = document.getElementById('beer-search-btn')
const userSearch = document.getElementById('user-search-btn')
const searchButtonArr = Array.from(document.getElementsByClassName('search-btn'))
const beerContainer = document.getElementById('beer-container')
const resultsContainer = document.getElementById('results-container')
const loadingContainer = document.getElementById('loading-container')
const pageNavigation = document.getElementById('page-navigation')
const filterOptions = Array.from(document.getElementsByClassName('filter-option'))
const filterOptionsContainer = document.getElementById('filter-options')

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

function setChecked (active) {
  active.checked = true
  filterOptions.forEach(option => {
    if (option !== active) {
      option.checked = false
    }
  })
}

beerSearch.addEventListener('click', function () {
  filterOptionsContainer.style.display = 'block'
  searchForm.q.select()
  searchForm.q.focus()
  activeButtons(this)
})

userSearch.addEventListener('click', function () {
  filterOptionsContainer.style.display = 'none'
  searchForm.q.select()
  searchForm.q.focus()
  activeButtons(this)
})

filterOptions.forEach(option => {
  option.addEventListener('click', function () {
    searchForm.q.select()
    searchForm.q.focus()
    setChecked(this)
  })
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
  e.preventDefault()
  searchButtonArr.forEach(button => {
    if (button.classList.contains('button-primary')) {
      checkSubmitValue(button.name)
    }
  })
})

function checkSubmitValue (searchItem) {
  const beerName = searchForm.q.value
  if (beerName.length >= 3) {
    if (searchItem === 'beer') {
      let filter
      filterOptions.forEach(option => {
        if (option.checked === true) {
          filter = option.value
        }
      })
      getInputValues(beerName, filter)
    } else {
      searchUser(beerName)
    }
  }
}

// DB calls
async function getInputValues (beerName, filter) {
  loadingContainer.classList.add('loading')
  try {
    const response = await fetch(`/search/beers/${filter}/?q=${beerName}`)
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
      clearContent(pageNavigation)
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
    sessionStorage.setItem('beersJSON', JSON.stringify(beers))
    sessionStorage.setItem('beerCards', JSON.stringify(beerContainer.innerHTML))
    sessionStorage.setItem('resultMessage', JSON.stringify(resultsContainer.innerHTML))
    sessionStorage.setItem('navigationButtons', JSON.stringify(pageNavigation.innerHTML))
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

async function searchUser (userName) {
  loadingContainer.classList.add('loading')
  try {
    const response = await fetch(`/search/users/?q=${userName}`)
    const users = await response.json()
    if (users.length < 1) {
      clearContent(beerContainer)
      displayErrorMessage(userName)
    } else {
      const startValue = 1
      let endValue
      if (users.length > 50) {
        endValue = 50
      } else {
        endValue = users.length
      }
      displayResultCount(userName, users.length, startValue, endValue)
      clearContent(beerContainer)
      clearContent(pageNavigation)
      users.forEach(async (user, index) => {
        if (user.active) {
          console.log(user.active)
          if (index <= 50) {
            const userCard = generateUserCard(user)
            await displayBeer(userCard)
          }
        }
      })
      if (users.length > 50) {
        addNextButton(users.length, users)
      }
    }
    sessionStorage.setItem('beersJSON', JSON.stringify(users))
    sessionStorage.setItem('beerCards', JSON.stringify(beerContainer.innerHTML))
    sessionStorage.setItem('resultMessage', JSON.stringify(resultsContainer.innerHTML))
    sessionStorage.setItem('navigationButtons', JSON.stringify(pageNavigation.innerHTML))
  } catch (err) {
    console.log(err)
  }
  loadingContainer.classList.remove('loading')
}

function generateBeerCard (beerObj) {
  let categoryName, styleName, styleLink, breweryName, breweryLink, countryFlag, countryCode, countryLink, rating, beerImage
  if (beerObj.beer.images.length !== 0) {
    beerImage = `/uploads/beers/${beerObj.beer._id}/${beerObj.beer.images[0].name}`
  } else {
    beerImage = `/images/bottle.png`
  }
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
  } if (beerObj.rating) {
    let numberType, blackStars, greyStars
    rating = ''
    beerObj.rating % 1 === 0 ? numberType = 'int' : numberType = 'float'
    switch (numberType) {
      case 'int':
        blackStars = beerObj.rating / 1
        for (let i = 1; i <= blackStars; i++) {
          rating += `
        <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
        }
        greyStars = 5 - blackStars
        for (let i = 1; i <= greyStars; i++) {
          rating += `
        <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
        }
        break
      case 'float':
        blackStars = beerObj.rating / 1
        for (let i = 1; i <= Math.floor(blackStars); i++) {
          rating += `
        <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-c7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
        }
        rating += `
         <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <path d="M0 0h24v24H0V0z" id="a"/>
          </defs>
          <clipPath id="b">
            <use overflow="visible" xlink:href="#a"/>
          </clipPath>
          <path clip-path="url(#b)" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
        </svg>
        `
        greyStars = Math.floor(5 - blackStars)
        for (let i = 1; i <= greyStars; i++) {
          rating += `
        <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `
        }
        break
    }

    rating += `
    <span class="va-middle card-subtitle">${beerObj.rating}</span>
    `
  } else {
    rating = `
     <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <span class="card-subtitle">N/A</span>
    `
  }
  const beerCard = `
    <div class="row" style="padding: 0.5rem;">
      <div class="card beer-card">
        <div class="row">
          <div class="one-third column">
            <div class="card-image">
              <img class="u-max-full-width" src="${beerImage}">
            </div>
          </div>
          <div class="two-thirds column">
            <div class="card-header">
              <div class="card-title">
                <a class="card-link" href="/beers/${beerObj.beer._id}">${beerObj.beer.name}</a>
              </div> 
              <div class="card-title">                  
                ${rating}
              </div>
              <div class="card-subtitle">
                  <a class="card-link">${categoryName}</a>
                  <a class="card-link" href="${styleLink}">${styleName}</a>
              </div>
              <div class="card-subtitle">
                 <a class="card-link" href="${breweryLink}">${breweryName}</a>
                 <a class="card-link" href="${countryLink}">${countryCode}</a>   
                  ${countryFlag}
              </div>
            </div>
          </div>
        </div>
      </div>
      `
  return beerCard
}

function generateUserCard (user) {
  let profileImg
  if (user.profileImg.length > 0) {
    profileImg = `/uploads/users/${user._id}/${user.profileImg}`
  } else {
    profileImg = '/images/user-placeholder.png'
  }
  if (user.active) {
    const userCard = `
      <div class="row" style="padding: 0.5rem;">
        <div class="card">
          <div class="row">
            <div class="one-third column">
              <div class="card-image flex-center mt-2-5">
                <img class="u-max-half-width circle" src="${profileImg}">
              </div>
            </div>
            <div class="two-thirds column">
              <div class="card-header">
                <div class="card-title">
                  <a class="card-link" href="/users/${user._id}">@${user.username}</a>
                  <img src="/images/flags/${user.country_id.flag}">
                </div> 
                <div class="card-title">                  
                  <a class="card-link" href="/users/${user._id}">${user.name}</a>
                </div>
                <div class="card-subtitle">
                  Followers: ${user.followers.length}
                  Following: ${user.following.length}
                </div>
                <div class="card-subtitle">
                  Consumes: ${user.consumes.length}
                  Ratings: ${user.ratings.length}
                  Reviews: ${user.reviews.length}
                </div>
              </div>
            </div>
          </div>
        </div>
        `
    return userCard
  }
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
