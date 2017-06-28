const beerIdElement = location.href
const beerId = beerIdElement.split('/')[4]
const consumeLink = document.getElementById('consume-link')
const consumeIcon = document.getElementById('consume-icon')
const editLink = document.getElementById('edit-link')
const ratingLink = document.getElementById('rating-link')
const ratingModal = document.getElementById('rating-modal')
const beerDescriptionForm = document.forms.beerDescription
const cancelButton = document.getElementById('cancel-description-btn')
const closeModal = document.getElementById('close-modal-btn')
const ratingModalBody = document.getElementById('rating-modal-body')
const ratingSymbols = Array.from(document.getElementsByClassName('add-rating-symbol'))

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
    const text = await response.text()
    if (text === 'Already Rated') {
      ratingModalBody.innerHTML = `
      <div class="toast toast-error">
        Error! You have already rated this beer.
      </div>
      `
    } else {
      ratingModalBody.innerHTML = `
      <div class="toast toast-success">
        Success! You rated this beer ${rating}.
      </div>
      `
    }
    setTimeout(() => {
      ratingModal.classList.remove('active')
    }, 1000)
  } catch (err) {
    console.log(err)
  }
}

consumeLink.onclick = () => {
  postConsume()
}

editLink.onclick = () => {
  beerDescriptionForm.removeAttribute('hidden')
}

cancelButton.onclick = () => {
  beerDescriptionForm.setAttribute('hidden', '')
}

ratingLink.onclick = () => {
  ratingModal.classList.add('active')
}

closeModal.onclick = () => {
  ratingModal.classList.remove('active')
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
      const text = await response.text()
      console.log(text)
    }
  } catch (err) {
    console.log(err)
  }
}

async function checkIfConsume () {
  try {
    const response = await fetch(`/beers/${beerId}/consume`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const text = await response.text()
    if (text === 'Consumed') {
      consumeIcon.src = '/icons/consumes.svg'
      consumeLink.setAttribute('data-tooltip', 'Consumed, nice!')
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

checkIfConsume()
avgRatingSymbols()
