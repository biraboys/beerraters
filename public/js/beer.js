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
    console.log(response)
  } catch (err) {
    console.log(err)
  }
}

window.onload = checkIfConsume()

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
