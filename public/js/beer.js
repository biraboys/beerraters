// Variables
const beerIdElement = location.href
const beerId = beerIdElement.split('/')[4]
const consumeLink = document.getElementById('consume-link')
const consumeIcon = document.getElementById('consume-icon')
const ratingIcon = document.getElementById('rating-icon')
const editLink = document.getElementById('edit-link')
const ratingLink = document.getElementById('rating-link')
const ratingModal = document.getElementById('rating-modal')
const beerDescriptionForm = document.forms.beerDescription
const cancelButton = document.getElementById('cancel-description-btn')
const closeModal = document.getElementById('close-modal-btn')
const closeEditModal = document.getElementById('close-edit-modal-btn')
const editModal = document.getElementById('edit-modal')
const ratingModalBody = document.getElementById('rating-modal-body')
const ratingSymbols = Array.from(document.getElementsByClassName('add-rating-symbol'))

// Click bindings
consumeLink.onclick = () => {
  checkIconColor('consume')
}

editLink.onclick = () => {
  editModal.classList.add('active')
  getBeerStyles()
  getBeerCountries()
}

closeEditModal.onclick = () => {
  editModal.classList.remove('active')
}

cancelButton.onclick = () => {
  editModal.classList.remove('active')
}

closeModal.onclick = () => {
  ratingModal.classList.remove('active')
}

ratingLink.onclick = () => {
  checkIconColor('rating')
}

// DOM functions
function checkIconColor (icon) {
  switch (icon) {
    case 'consume':
      if (consumeIcon.getAttribute('fill') === '#E8EDFA') {
        postConsume()
      }
      break
    case 'rating':
      if (ratingIcon.getAttribute('fill') === '#E8EDFA') {
        ratingModal.classList.add('active')
      }
      break
  }
}

ratingSymbols.forEach((symbol, index) => {
  symbol.addEventListener('mouseover', () => {
    changeSymbolColor(symbol, index)
  })
  symbol.addEventListener('click', () => {
    postRating(index)
  })
})

function changeSymbolColor (symbol, position) {
  const color = symbol.getAttribute('fill')
  if (color === '#E8EDFA') {
    ratingSymbols.forEach((symbol, index) => {
      if (index <= position) {
        symbol.setAttribute('fill', '#000000')
      }
    })
  } else {
    ratingSymbols.forEach((symbol, index) => {
      if (index >= position) {
        symbol.setAttribute('fill', '#E8EDFA')
      }
    })
  }
}

// Helper functions
function sortByName (array) {
  return array.sort((a, b) => {
    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
  })
}

// DB functions
async function postRating (index) {
  const rating = index + 1
  try {
    const response = await fetch(`/beers/${beerId}/rating`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        rating: rating
      }),
      credentials: 'same-origin'
    })
    ratingModalBody.innerHTML = `
      <div class="toast toast-success">
        Success! You rated this beer ${rating}.
      </div>
      `
    setTimeout(() => {
      ratingModal.classList.remove('active')
      location.reload(true)
    }, 2000)
  } catch (err) {
    console.log(err)
  }
}

async function postConsume () {
  try {
    const response = await fetch(`/beers/${beerId}/consume`, {
      method: 'post',
      credentials: 'same-origin'
    })
    const status = response.status
    if (status === 500) {
      window.location.href = '/login'
    } else {
      const beerName = document.getElementById('beer-name').innerHTML
      ratingModal.classList.add('active')
      ratingModalBody.innerHTML = `
      <div class="toast toast-success">
        Hope your ${beerName} tasted good! .
      </div>
      `
      setTimeout(() => {
        ratingModal.classList.remove('active')
        location.reload(true)
      }, 2000)
    }
  } catch (err) {
    console.log(err)
  }
}

async function checkContributions () {
  try {
    const response = await fetch(`/beers/${beerId}/contributions`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const json = await response.json()
    const userId = json.user
    const contributions = json.beer
    const ratingUsers = contributions.ratings.map(rating => {
      return rating.user
    })
    if (contributions.consumes.indexOf(userId) !== -1) {
      consumeIcon.setAttribute('fill', '#000000')
      consumeLink.setAttribute('data-tooltip', 'Consumed, nice!')
    }
    if (ratingUsers.indexOf(userId) !== -1) {
      ratingIcon.setAttribute('fill', '#000000')
      ratingLink.setAttribute('data-tooltip', 'Already rated')
    }
  } catch (err) {
    console.log(err)
  }
}

async function avgRatingSymbols () {
  const ratingContainer = document.getElementById('rating-container')
  try {
    const response = await fetch(`/beers/${beerId}/rating`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const rating = await response.json()
    if (rating !== 0) {
      let numberType
      rating % 1 === 0 ? numberType = 'int' : numberType = 'float'
      switch (numberType) {
        case 'int':
          for (let i = 1; i <= rating; i++) {
            ratingContainer.innerHTML += `
          <svg class="va-middle avg-rating-star" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        `
          }
          const ratingStarsAmount = document.getElementsByClassName('avg-rating-star').length
          for (let i = ratingStarsAmount; i < 5; i++) {
            ratingContainer.innerHTML += `
          <svg class="va-middle avg-rating-star" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        `
          }
          ratingContainer.innerHTML += `
          <span class="va-middle card-subtitle">${rating}</span>
          `
          break
        case 'float':
          for (let i = 1; i <= rating; i++) {
            ratingContainer.innerHTML += `
          <svg class="va-middle avg-rating-star" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        `
          }
          ratingContainer.innerHTML += `
        <svg class="va-middle avg-rating-star" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <path d="M0 0h24v24H0V0z" id="a"/>
          </defs>
          <clipPath id="b">
            <use overflow="visible" xlink:href="#a"/>
          </clipPath>
          <path clip-path="url(#b)" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
        </svg>
         `
          const ratingStarsAmountFloat = document.getElementsByClassName('avg-rating-star').length
          for (let i = ratingStarsAmountFloat; i < 5; i++) {
            ratingContainer.innerHTML += `
          <svg class="va-middle avg-rating-star" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        `
          }
          ratingContainer.innerHTML += `
          <span class="va-middle card-subtitle">${rating}</span>
          `
          break
      }
    }
  } catch (err) {
    console.log(err)
  }
}

async function getBeerStyles () {
  const currentStyle = document.getElementById('current-style') || ''
  try {
    const response = await fetch('/styles')
    const styles = await response.json()
    styles.forEach(style => {
      beerDescriptionForm.style.innerHTML += `
       <option value="${style._id}">${style.name}</option>
      `
    })
    beerDescriptionForm.style.onchange = function () {
      showMatchingCategories(this.value)
    }
  } catch (err) {
    console.log(err)
  }
}

async function showMatchingCategories (style) {
  try {
    const response = await fetch(`/styles/${style}/categories`)
    const categories = await response.json()
    if (categories.length > 0) {
      const categoryInput = beerDescriptionForm.category
      const otherCategoryInput = beerDescriptionForm.otherCategory
      categoryInput.removeAttribute('disabled')
      categoryInput.innerHTML = ''
      categories.forEach(category => {
        categoryInput.innerHTML +=
          `
          <option value="${category.name}">${category.name}</option>
          `
      })
      categoryInput.innerHTML += `
        <option value="Other">Other</option>
        `
      beerDescriptionForm.category.onchange = function () {
        if (this.value === 'Other') {
          otherCategoryInput.removeAttribute('hidden')
          otherCategoryInput.setAttribute('required', true)
        } else {
          otherCategoryInput.setAttribute('hidden', true)
          otherCategoryInput.removeAttribute('required')
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}
async function getBeerCountries () {
  const currentCountry = document.getElementById('current-country') || ''
  try {
    const response = await fetch('/countries')
    const countries = await response.json()
    sortByName(countries)
    countries.forEach(country => {
      beerDescriptionForm.country.innerHTML += `
       <option value="${country._id}">${country.name}</option>
      `
    })
    beerDescriptionForm.country.onchange = function () {
      showMatchingBreweries(this.value)
    }
  } catch (err) {
    console.log(err)
  }
}

async function showMatchingBreweries (country) {
  const breweriesInput = beerDescriptionForm.brewery
  const otherBreweryInput = beerDescriptionForm.otherBrewery
  breweriesInput.removeAttribute('disabled')
  breweriesInput.innerHTML = ''
  otherBreweryInput.setAttribute('hidden', true)
  try {
    const response = await fetch(`/countries/${country}/breweries`)
    const breweries = await response.json()
    if (breweries.length > 0) {
      sortByName(breweries)
      breweries.forEach(brewery => {
        breweriesInput.innerHTML +=
          `
          <option value="${brewery._id}">${brewery.name}</option>
          `
      })
      breweriesInput.innerHTML += `
        <option value="Other">Other</option>
        `
      beerDescriptionForm.brewery.onchange = function () {
        if (this.value === 'Other') {
          otherBreweryInput.removeAttribute('hidden')
          getCountryStates(country)
        } else {
          otherBreweryInput.setAttribute('hidden', true)
        }
      }
    } else {
      breweriesInput.innerHTML = `
        <option value="Other">Other</option>
        `
      otherBreweryInput.removeAttribute('hidden')
      getCountryStates(country)
    }
  } catch (err) {

  }
}

async function getCountryStates (country) {
  const statesInput = beerDescriptionForm.state
  const otherStateInput = beerDescriptionForm.otherState
  statesInput.removeAttribute('hidden')
  statesInput.innerHTML = ''
  otherStateInput.setAttribute('hidden', true)
  try {
    const response = await fetch(`/countries/${country}/states`)
    const states = await response.json()
    if (states.length > 0) {
      sortByName(states)
      states.forEach(state => {
        statesInput.innerHTML +=
          `
          <option value="${state._id}">${state.name}</option>
          `
      })
      statesInput.innerHTML += `
        <option value="Other">Other</option>
        `
      beerDescriptionForm.brewery.onchange = function () {
        if (this.value === 'Other') {
          otherStateInput.removeAttribute('hidden')
        } else {
          otherStateInput.setAttribute('hidden', true)
        }
      }
    } else {
      statesInput.innerHTML = `
        <option value="Other">Other</option>
        `
      otherStateInput.removeAttribute('hidden')
    }
  } catch (err) {
    console.log(err)
  }
}

// Init calls
checkContributions()
avgRatingSymbols()
