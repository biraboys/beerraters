/**
 * Adds click functions for user to consume, rate, review, upload image of beer
 */
function addContributionButtonsListeners () {
  document.getElementById('add-consume-button').onclick = () => {
    addConsume()
  }
  document.getElementById('post-rating-button').onclick = () => {
    addRatingSliderandFormListeners()
    $('#rating-modal').modal('open')
  }
  document.getElementById('write-review-button').onclick = async () => {
    addReviewFormListeners()
    $('#review-modal').modal('open')
  }
  document.getElementById('upload-image-button').onclick = () => {
    document.getElementById('upload-image-form').addEventListener('submit', e => {
      e.preventDefault()
      document.getElementById('loading-container').classList.add('active')
      uploadImage()
      $('#image-modal').modal('open')
    })
  }
}

/**
 * Adds event listerns for slider and form in rating modal
 */
function addRatingSliderandFormListeners () {
  document.getElementById('rating-slider').addEventListener('input', function () {
    changeSymbolColor(this.value)
  })
  document.forms.ratingForm.addEventListener('submit', e => {
    const ratingSliderValue = document.getElementById('rating-slider').value
    e.preventDefault()
    postRating(ratingSliderValue)
  })
}

/**
 * Changes color of rating stars as user drags slider
 * @param {Number} ratingSliderValue - Value of rating slider
 */
function changeSymbolColor (ratingSliderValue) {
  const ratingSymbols = Array.from(document.getElementsByClassName('add-rating-symbol'))
  const position = ratingSliderValue - 1
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

/**
 * Posts beer rating in back end
 * @param {number} rating - Rating of beer 
 */
async function postRating (rating) {
  const beerName = document.getElementById('beer-name').innerHTML
  const beerId = location.href.split('/')[4]
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
    if (response.status === 201) {
      await avgRatingSymbols()
      updateRatingElementsInDom(beerName, rating)
    }
  } catch (err) {
    Materialize.toast(`Sorry could not rate ${beerName}`, 2000)
  }
}

/**
 * Post consume to backend and display toast
 */
async function addConsume () {
  const beerName = document.getElementById('beer-name').innerText
  const beerId = location.href.split('/')[4]
  try {
    const response = await fetch(`/beers/${beerId}/consume`, {
      method: 'post',
      credentials: 'same-origin'
    })
    if (response.status === 201) {
      updateConsumeElementsInDom(beerName)
    }
  } catch (err) {
    Materialize.toast(`Sorry could not consume ${beerName}`, 2000)
  }
}

/**
 * Gets beer ratings, reviews, images, contributions and current user's id from backend
 */
async function getContributions () {
  const beerId = location.href.split('/')[4]
  try {
    const response = await fetch(`/beers/${beerId}/contributions`, {
      method: 'get',
      credentials: 'same-origin'
    })
    if (response.status === 200) {
      const json = await response.json()
      checkAndDisplayContributions(json)
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Fetches average rating of beer from backend and displays it in DOM
 */
async function avgRatingSymbols () {
  const ratingContainer = document.getElementById('rating-container')
  const beerId = location.href.split('/')[4]
  try {
    const response = await fetch(`/beers/${beerId}/rating`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const rating = await response.json()
    if (rating !== 0) {
      let numberType
      rating % 1 === 0 ? numberType = 'int' : numberType = 'float'
      ratingContainer.innerHTML = ''
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

/**
 * Checks all reviews for beer in back end
 */
async function checkReviews () {
  const beerId = location.href.split('/')[4]
  try {
    const response = await fetch(`/beers/${beerId}/review`, {
      method: 'get',
      credentials: 'same-origin'
    })
    if (response.status === 200) {
      const reviewsObj = await response.json()
      if (reviewsObj.reviews.length > 0) {
        reviewsObj.reviews.forEach(async reviewObj => {
          await getReview(reviewObj)
        })
      }
    }
  } catch (err) {
    Materialize.toast('Sorry, could not get reviews', 2000)
  }
}

/**
 * Gets a single review from back end
 * @param {Object} reviewObj - Review object populated from Beer schema
 */
async function getReview (reviewObj) {
  try {
    const reviewResponse = await fetch(`/reviews/${reviewObj.review_id}`)
    if (reviewResponse.status === 200) {
      const review = await reviewResponse.json()
      getReviewUserImage(review)
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Gets a single review from back end
 * @param {Object} reviewId - Id of newly posted review
 */
async function getNewReview (reviewId) {
  try {
    const reviewResponse = await fetch(`/reviews/${reviewId}`)
    if (reviewResponse.status === 200) {
      const review = await reviewResponse.json()
      getReviewUserImage(review)
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Gets user image of current review
 * @param {Object} review - Review object from schema
 */
async function getReviewUserImage (review) {
  try {
    const userImageResponse = await fetch(`/users/${review.user_id._id}/get-profileimage`, {
      method: 'get',
      credentials: 'same-origin'
    })
    if (userImageResponse.status === 200) {
      const userImage = await userImageResponse.blob()
      const image = createUserImage(userImage)
      displayReview(review, image)
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Gets Buffer of beer images from backend
 */
async function getBeerImages () {
  const beerId = location.href.split('/')[4]
  const imageAmount = Number(document.getElementById('image-amount-span').innerText)
  if (imageAmount > 0) {
    try {
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
        if (response.status === 200) {
          const beerImageBlob = await response.blob()
          const userName = response.headers.get('User-Name')
          createBeerImage(beerImageBlob, userName)
        }
        i++
      }
      $('.materialboxed').materialbox()
    } catch (err) {
      console.log(err)
    }
  }
}

/**
 * Gets Buffer of upload beer images from backend
 */
async function getUplaodedBeerImage () {
  const beerId = location.href.split('/')[4]
  const imageIndex = Number(document.getElementById('image-amount-span').innerText) - 1
  try {
    const response = await fetch(`/beers/${beerId}/getImage`, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify({
        index: imageIndex
      })
    })
    if (response.status === 200) {
      const beerImageBlob = await response.blob()
      const userName = response.headers.get('User-Name')
      createBeerImage(beerImageBlob, userName)
    }
    $('.materialboxed').materialbox()
  } catch (err) {
    console.log(err)
  }
}

/**
 * Add submit listener for review form and validates review contents in front end
 */
function addReviewFormListeners () {
  const beerId = location.href.split('/')[4]
  const reviewForm = document.forms.reviewForm
  const reviewLabel = document.getElementById('review-label')
  const review = document.getElementById('review')
  reviewForm.addEventListener('submit', async function (e) {
    e.preventDefault()
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
              review: reviewForm.review.value
            })
          })
          if (response.status === 201) {
            const newReview = await response.json()
            await getNewReview(newReview._id)
            updateReviewElementsInDom()
          }
        } catch (err) {
          Materialize.toast(`Sorry could not review beer`, 2000)
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
}

/**
 * Creates a user image to be displayed in DOM
 * @param {String} imageBlob - HTML blob of user image
 */
function createUserImage (imageBlob) {
  const image = document.createElement('img')
  const objectURL = URL.createObjectURL(imageBlob)
  image.src = objectURL
  image.setAttribute('class', 'circle')
  return image
}

/**
 * Creates a beer image to be displayed in DOM
 * @param {String} beerImageBlob - HTML blob of beer image
 * @param {String} userName - Username to use for beer image caption
 */
function createBeerImage (beerImageBlob, userName) {
  const beerImageContainer = document.getElementById('beer-image-container')
  const beerImage = document.createElement('img')
  const objectURL = URL.createObjectURL(beerImageBlob)
  beerImage.src = objectURL
  beerImage.setAttribute('class', 'responsive-img materialboxed caption-images')
  beerImage.setAttribute('data-caption', `Posted by ${userName}`)
  beerImageContainer.insertAdjacentElement('afterbegin', beerImage)
}

/**
 * Checks if user has contrbuted to the beer and hides DOM actions buttons if so
 * @param {Object} json - Beer ratings, reviews, images, consumes and current user's id
 */
function checkAndDisplayContributions (json) {
  const userId = json.user_id
  const beer = json.beer
  const ratingUsers = beer.ratings.map(rating => rating.user)
  const userImages = beer.images.map(image => image.user_id)
  const userReviews = beer.reviews.map(review => review.user_id)
  const consumeButton = document.getElementById('add-consume-button')
  const imageButton = document.getElementById('upload-image-button')
  const ratingButton = document.getElementById('post-rating-button')
  const reviewButton = document.getElementById('write-review-button')
  if (!beer.consumes.includes(userId)) consumeButton.style.display = 'block'
  if (!userReviews.includes(userId)) reviewButton.style.display = 'block'
  if (!userImages.includes(userId)) imageButton.style.display = 'block'
  if (!ratingUsers.includes(userId)) ratingButton.style.display = 'block'
}
/**
 * Displays success message to user and updates number of ratings
 * @param {String} beerName - Name of rated beer
 * @param {Number} rating - Rating of beer
 */
function updateRatingElementsInDom (beerName, rating) {
  let ratingAmoutSpanText = document.getElementById('rating-amount-span').innerText
  let ratingAmout = Number(ratingAmoutSpanText)
  document.getElementById('post-rating-button').style.display = 'none'
  ratingAmout++
  document.getElementById('rating-amount-span').innerText = ratingAmout
  $('#rating-modal').modal('close')
  Materialize.toast(`You rated ${beerName} ${rating}`, 2000)
}

/**
 * Displays success message to user and updates number of consumes
 * @param {String} beerName - Name of consumed beer
 */
function updateConsumeElementsInDom (beerName) {
  let consumeAmoutSpanText = document.getElementById('consume-amount-span').innerText
  let consumeAmout = Number(consumeAmoutSpanText)
  document.getElementById('add-consume-button').style.display = 'none'
  consumeAmout++
  document.getElementById('consume-amount-span').innerText = consumeAmout
  Materialize.toast(`Hope your ${beerName} tasted good!`, 2000)
}

/**
 * Displays success message to user and updates number of review
 * @param {String} beerName - Name of reviewed beer
 */
function updateReviewElementsInDom () {
  let reviewAmoutSpanText = document.getElementById('review-amount-span').innerText
  let reviewAmout = Number(reviewAmoutSpanText)
  document.getElementById('write-review-button').style.display = 'none'
  reviewAmout++
  if (document.getElementById('no-reviews-message') !== null) {
    $('#no-reviews-message').remove()
  }
  document.getElementById('review-amount-span').innerText = reviewAmout
  $('#review-modal').modal('close')
  Materialize.toast(`Your review was posted!`, 2000)
}

/**
 * Displays review in DOM
 * @param {String} userImage - String representation of HTML element img
 */
function displayReview (review, userImage) {
  const reviewsContainer = document.getElementById('reviews-container')
  const reviewHtml = `
  <div class="card-panel col s12 m4">
    <li class="collection-item avatar">
      ${userImage.outerHTML}
      <span class="title"><a href="/users/${review.user_id._id}"><strong>${review.user_id.username}</strong></a></span>
      <p>
        <span class="card-subtitle">${review.place}</span>
        <br>
        ${review.body}
      </p>
    </li>
  </div>
`
  reviewsContainer.insertAdjacentHTML('afterbegin', reviewHtml)
}

/**
 * Uploads beer image to back end
 */
async function uploadImage () {
  const beerId = location.href.split('/')[4]
  const imageForm = document.getElementById('upload-image-form')
  try {
    const formData = new FormData(imageForm)
    const response = await fetch(`/beers/${beerId}/addImage`, {
      method: 'post',
      credentials: 'same-origin',
      body: formData
    })
    if (response.status === 201) {
      updateImageElementsInDom()
      getUplaodedBeerImage()
    }
  } catch (err) {
    console.log(err)
    Materialize.toast('Sorry, could not post your photo', 2000)
  }
}

/**
 * Displays success message to user and updates number of images
 */
function updateImageElementsInDom () {
  let imageAmoutSpanText = document.getElementById('image-amount-span').innerText
  let imageAmout = Number(imageAmoutSpanText)
  document.getElementById('upload-image-button').style.display = 'none'
  imageAmout++
  document.getElementById('image-amount-span').innerText = imageAmout
  if (document.getElementById('no-images-message') !== null) {
    $('#no-images-message').remove()
  }
  document.getElementById('loading-container').classList.remove('active')
  $('#image-modal').modal('close')
  Materialize.toast('Your photo was posted!', 2000)
}

// Init calls
(async () => {
  await Promise.all([
    getBeerImages(),
    getContributions(),
    checkReviews()
  ])
  addContributionButtonsListeners()
  avgRatingSymbols()
})()
