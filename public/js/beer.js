const beerIdElement = location.href
const beerId = beerIdElement.split('/')[4]
const consumeLink = document.getElementById('consume-link')
const consumeIcon = document.getElementById('consume-icon')

window.onload = checkIfConsume()

consumeLink.onclick = () => {
  postConsume()
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
