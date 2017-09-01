// Variables
const beerIdElement = location.href
const beerId = beerIdElement.split('/')[4]
const consumeLink = document.getElementById('consume-link')
const imageLink = document.getElementById('image-link')
const consumeIcon = document.getElementById('consume-icon')
const ratingIcon = document.getElementById('rating-icon')
const imageIcon = document.getElementById('image-icon')
const reviewIcon = document.getElementById('review-icon')
// const editLink = document.getElementById('edit-link')
const beerDescriptionForm = document.forms.beerDescription
const ratingLink = document.getElementById('rating-link')
const reviewLink = document.getElementById('review-link')
const ratingModal = document.getElementById('rating-modal')
const reviewModal = document.getElementById('review-modal')
const reviewForm = document.forms.reviewForm
const cancelButton = document.getElementById('cancel-description-btn')
const closeModal = document.getElementById('close-modal-btn')
const editModal = document.getElementById('edit-modal')
const imageModal = document.getElementById('image-modal')
const ratingModalBody = document.getElementById('rating-modal-body')
const ratingSymbols = Array.from(document.getElementsByClassName('add-rating-symbol'))
const stateGroup = document.getElementById('state-group')
const submitImgBtn = document.getElementById('submit-img-btn')
const review = document.getElementById('review')
const reviewLabel = document.getElementById('review-label')
const reviewBtn = document.getElementById('review-btn')
const ratingSlider = document.getElementById('rating-slider')

// Click bindings
consumeLink.onclick = () => {
  checkIconColor('consume')
}

imageLink.onclick = () => {
  checkIconColor('image')
}

reviewLink.onclick = () => {
  checkIconColor('review')
}

// editLink.onclick = () => {
//   $('#edit-modal').modal('open')
//   getBeerStyles()
//   getBeerCountries()
// }

submitImgBtn.onclick = () => {
  imageModal.classList.remove('active')
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
        $('#rating-modal').modal('open')
      }
      break
    case 'image':
      if (imageIcon.getAttribute('fill') === '#E8EDFA') {
        $('#image-modal').modal('open')
      }
      break
    case 'review':
      if (reviewIcon.getAttribute('fill') === '#E8EDFA') {
        $('#review-modal').modal('open')
      }
      break
  }
}
ratingSlider.addEventListener('input', function () {
  changeSymbolColor(this.value - 1)
})

document.forms.ratingForm.addEventListener('submit', e => {
  e.preventDefault()
  postRating(ratingSlider.value)
})

function changeSymbolColor (position) {
  const symbol = ratingSymbols[position]
  const color = symbol.getAttribute('fill')
  if (color === '#E8EDFA') {
    ratingSymbols.forEach((symbol, index) => {
      if (index <= position) {
        symbol.setAttribute('fill', '#000000')
      }
    })
  } else {
    ratingSymbols.forEach((symbol, index) => {
      if (index > position) {
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
async function postRating (rating) {
  const beerName = document.getElementById('beer-name').innerHTML
  rating = Number(rating)
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
    if (response.status === 500) {
      Materialize.toast(`Sorry could not rate ${beerName}`, 2000)
    } else {
      Materialize.toast(`You rated ${beerName} ${rating}`, 2000)
      $('#rating-modal').modal('close')
      ratingIcon.setAttribute('fill', '#000000')
      ratingLink.setAttribute('data-tooltip', 'Already rated')
      $(ratingLink).tooltip()
      location.reload(true)
    }
  } catch (err) {
    console.log(err)
  }
}

async function postConsume () {
  const beerName = document.getElementById('beer-name').innerHTML
  try {
    const response = await fetch(`/beers/${beerId}/consume`, {
      method: 'post',
      credentials: 'same-origin'
    })
    if (response.status === 500) {
      Materialize.toast(`Sorry could not consume ${beerName}`, 2000)
    } else {
      Materialize.toast(`Hope your ${beerName} tasted good!`, 2000)
      consumeIcon.setAttribute('fill', '#000000')
      consumeLink.setAttribute('data-tooltip', 'Consumed, nice!')
      $(consumeLink).tooltip()
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
    const userImages = contributions.images.map(image => {
      return image.user_id
    })
    const userReviews = contributions.reviews.map(review => {
      return review.user_id
    })
    if (contributions.consumes.indexOf(userId) !== -1) {
      consumeIcon.setAttribute('fill', '#000000')
      consumeLink.setAttribute('data-tooltip', 'Consumed, nice!')
      $(consumeLink).tooltip()
    }
    if (userReviews.indexOf(userId) !== -1) {
      reviewIcon.setAttribute('fill', '#000000')
      reviewLink.setAttribute('data-tooltip', 'Reviewed')
      $(reviewLink).tooltip()
    }
    if (userImages.indexOf(userId) !== -1) {
      imageIcon.setAttribute('fill', '#000000')
      imageLink.setAttribute('data-tooltip', 'Posted photo')
      $(imageLink).tooltip()
    }
    if (ratingUsers.indexOf(userId) !== -1) {
      ratingIcon.setAttribute('fill', '#000000')
      ratingLink.setAttribute('data-tooltip', 'Already rated')
      $(ratingLink).tooltip()
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

// async function getBeerStyles () {
//   try {
//     const response = await fetch('/styles')
//     const styles = await response.json()
//     sortByName(styles)
//     styles.forEach(style => {
//       beerDescriptionForm.style.innerHTML += `
//        <option value="${style._id}">${style.name}</option>
//       `
//     })
//     beerDescriptionForm.style.onchange = function () {
//       showMatchingCategories(this.value)
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

// async function showMatchingCategories (style) {
//   try {
//     const response = await fetch(`/styles/${style}/categories`)
//     const categories = await response.json()
//     if (categories.length > 0) {
//       const categoryInput = beerDescriptionForm.category
//       const otherCategoryInput = beerDescriptionForm.otherCategory
//       sortByName(categories)
//       categoryInput.removeAttribute('disabled')
//       categoryInput.innerHTML = ''
//       categories.forEach(category => {
//         categoryInput.innerHTML +=
//           `
//           <option value="${category.name}">${category.name}</option>
//           `
//       })
//       categoryInput.innerHTML += `
//         <option value="Other">Other</option>
//         `
//       beerDescriptionForm.category.onchange = function () {
//         if (this.value === 'Other') {
//           otherCategoryInput.removeAttribute('hidden')
//           otherCategoryInput.setAttribute('required', true)
//         } else {
//           otherCategoryInput.setAttribute('hidden', true)
//           otherCategoryInput.removeAttribute('required')
//         }
//       }
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }
// async function getBeerCountries () {
//   try {
//     const response = await fetch('/countries')
//     const countries = await response.json()
//     sortByName(countries)
//     countries.forEach(country => {
//       beerDescriptionForm.country.innerHTML += `
//        <option value="${country._id}">${country.name}</option>
//       `
//     })
//     beerDescriptionForm.country.onchange = function () {
//       showMatchingBreweries(this.value)
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

// async function showMatchingBreweries (country) {
//   const breweriesInput = beerDescriptionForm.brewery
//   const otherBreweryInput = beerDescriptionForm.otherBrewery
//   breweriesInput.removeAttribute('disabled')
//   breweriesInput.innerHTML = ''
//   otherBreweryInput.setAttribute('hidden', true)
//   stateGroup.setAttribute('hidden', true)
//   try {
//     const response = await fetch(`/countries/${country}/breweries`)
//     const breweries = await response.json()
//     if (breweries.length > 0) {
//       const loader = document.getElementById('loader')
//       loader.classList.add('loading')
//       sortByName(breweries)
//       breweries.forEach(brewery => {
//         breweriesInput.innerHTML +=
//           `
//           <option value="${brewery.name}">${brewery.name}</option>
//           `
//       })
//       breweriesInput.innerHTML += `
//         <option value="Other">Other</option>
//         `
//       beerDescriptionForm.brewery.onchange = function () {
//         if (this.value === 'Other') {
//           otherBreweryInput.removeAttribute('hidden')
//           getCountryStates(country)
//         } else {
//           stateGroup.setAttribute('hidden', true)
//           otherBreweryInput.setAttribute('hidden', true)
//         }
//       }
//       loader.classList.remove('loading')
//     } else {
//       breweriesInput.innerHTML = `
//         <option value="Other">Other</option>
//         `
//       otherBreweryInput.removeAttribute('hidden')
//       getCountryStates(country)
//     }
//   } catch (err) {

//   }
// }

// async function getCountryStates (country) {
//   const statesInput = beerDescriptionForm.state
//   const otherStateInput = beerDescriptionForm.otherState
//   stateGroup.removeAttribute('hidden')
//   statesInput.innerHTML = ''
//   otherStateInput.setAttribute('hidden', true)
//   try {
//     const response = await fetch(`/countries/${country}/states`)
//     const states = await response.json()
//     if (states.length > 0) {
//       sortByName(states)
//       states.forEach(state => {
//         statesInput.innerHTML +=
//           `
//           <option value="${state.name}">${state.name}</option>
//           `
//       })
//       statesInput.innerHTML += `
//         <option value="Other">Other</option>
//         `
//       beerDescriptionForm.brewery.onchange = function () {
//         if (this.value === 'Other') {
//           otherStateInput.removeAttribute('hidden')
//         } else {
//           otherStateInput.setAttribute('hidden', true)
//         }
//       }
//     } else {
//       statesInput.innerHTML = `
//         <option value="Other">Other</option>
//         `
//       otherStateInput.removeAttribute('hidden')
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

async function getCountries () {
  try {
    const response = await fetch('/countries')
    const countries = await response.json()
    sortByName(countries)
    await countries.forEach(country => {
      reviewForm.location.innerHTML += `
      <option value="${country._id}">${country.name}</option>
      `
    })
  } catch (err) {
    console.log(err)
  }
}

reviewForm.place.addEventListener('focus', displayCountries)

function displayCountries () {
  $('select').material_select()
  this.removeEventListener('focus', displayCountries)
}

async function checkReviews () {
  const reviewsContainer = document.getElementById('reviews-container')
  try {
    const response = await fetch(`/beers/${beerId}/review`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const reviewsObj = await response.json()
    if (reviewsObj.reviews.length > 0) {
      reviewsObj.reviews.forEach(async obj => {
        const reviewResponse = await fetch(`/reviews/${obj.review_id}`)
        const review = await reviewResponse.json()
        const userImage = await fetch(`/users/${review.user_id._id}/get-profileimage`, {
          method: 'get',
          credentials: 'same-origin'
        })
        const img = await userImage.blob()
        const image = createUserImage(img)
        reviewsContainer.innerHTML += `
            <div class="card-panel">
             <li class="collection-item avatar">
      ${image.outerHTML}
      <span class="title"><a href="/users/${review.user_id._id}"><strong>${review.user_id.username}</strong></a></span>
      <p>
         <span class="card-subtitle">${review.place} in </span><a class="card-link" href="/countries/${review.country_id._id}">${review.country_id.name}</a> <br>
         ${review.body}
      </p>
    </li>
  </div>
        `
      })
    }
  } catch (err) {
    console.log(err)
  }
}

// async function getImages () {
//   try {
//     const response = await fetch(`/beers/${beerId}/images`, {
//       credentials: 'same-origin'
//     })
//     const json = await response.json()
//     const img = document.createElement('img')
//     const path = json[0].img_name
//     img.src = `/images/uploads/beers/${path}`
//     console.log(img)
//   } catch (err) {

//   }
// }

async function getBeerImage () {
  const imageContainer = document.getElementById('image-container')
  try {
    const response = await fetch(`/beers/${beerId}/images`)
    const imageAmount = await response.text()
    if (imageAmount === '0') {
      imageContainer.innerHTML += `
        <img class="responsive-img" src="/images/bottle.png">
      `
    } else {
      let i = 0
      while (i < imageAmount) {
        const response = await fetch(`/beers/${beerId}/getImage`, {
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          method: 'post',
          credentials: 'same-origin',
          body: JSON.stringify({
            index: i
          })
        })
        const image = document.createElement('img')
        const img = await response.blob()
        const userName = response.headers.get('User-Name')
        const objectURL = URL.createObjectURL(img)
        image.src = objectURL
        image.setAttribute('class', 'responsive-img materialboxed caption-images')
        image.setAttribute('data-caption', `Posted by ${userName}`)
        imageContainer.appendChild(image)
        i++
      }
      $('.materialboxed').materialbox()
    }
  } catch (err) {
    console.log(err)
  }
}

reviewForm.addEventListener('submit', async function (e) {
  e.preventDefault()
  const beerName = document.getElementById('beer-name').innerHTML
  if (review.value.length > 0 && review.value.length < 121) {
    if (!review.value.replace(/\s/g, '').length) {
      reviewLabel.classList.add('invalid')
      reviewLabel.innerHTML = `This seems like a funny review... eh?`
      reviewLabel.style.color = '#F44336'
    } else {
      try {
        const response = await fetch(`/beers/${beerId}/review`, {
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          method: 'post',
          credentials: 'same-origin',
          body: JSON.stringify({
            place: reviewForm.place.value,
            location: reviewForm.location.value,
            review: reviewForm.review.value
          })
        })
        if (response.status === 500) {
          Materialize.toast(`Sorry could not review ${beerName}`, 2000)
        } else {
          Materialize.toast(`You reviewed ${beerName}, thanks!`, 2000)
          reviewIcon.setAttribute('fill', '#000000')
          reviewLink.setAttribute('data-tooltip', 'Reviewed')
          $(reviewLink).tooltip()
          $('#review-modal').modal('close')
          setTimeout(() => {
            location.href = location.pathname
          }, 1000)
        }
      } catch (err) {
        console.log(err)
      }
    }
  } else if (review.value.length > 120) {
    review.classList.add('invalid')
    reviewLabel.innerHTML = 'Too many characters.'
    reviewLabel.style.color = '#F44336'
  } else {
    review.classList.add('invalid')
    reviewLabel.innerHTML = 'Please enter some text here...'
    reviewLabel.style.color = '#F44336'
  }
})

function createUserImage (imageBlob) {
  const image = document.createElement('img')
  const objectURL = URL.createObjectURL(imageBlob)
  image.src = objectURL
  image.setAttribute('class', 'circle')
  return image
}

// Init calls
getBeerImage()
checkContributions()
avgRatingSymbols()
checkReviews()
getCountries()
