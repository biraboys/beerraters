const follow = document.getElementById('follow')
const followers = document.getElementById('followers')
const userIdElement = location.href
const userId = userIdElement.split('/')[4]

if (follow) {
  follow.addEventListener('click', function (e) {
    e.preventDefault()
    followUser()
  })
}

async function followUser () {
  const id = follow.dataset.id
  const response = await fetch(`/users/${id}/follow`, {
    method: 'post',
    credentials: 'same-origin'
  })
  if (response.status === 401) {
    console.log(response.status)
    window.location.href = '/login'
  } else if (response.status === 200) {
    if (follow.innerHTML === 'Follow') {
      const value = parseInt(followers.innerHTML) + 1
      followers.innerHTML = value
      follow.innerHTML = 'Unfollow'
    } else {
      const value = parseInt(followers.innerHTML) - 1
      followers.innerHTML = value
      follow.innerHTML = 'Follow'
    }
  }
}

async function getUserReviews () {
  const reviewsContainer = document.getElementById('reviews-container')
  try {
    const response = await fetch(`/users/${userId}/reviews`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const reviewsObj = await response.json()
    reviewsObj.reviews.forEach(async review => {
      const beerResponse = await fetch(`/beers/fetch/${review.beer_id}`)
      const beerObj = await beerResponse.json()
      const beerImageResponse = await fetch(`/beers/${review.beer_id}/images`)
      const beerImageArr = await beerImageResponse.json()
      const beerImage = beerImageArr[0].name
      reviewsContainer.innerHTML += `
                <div class="tile">
                <div class="tile-icon">
                  <figure class="avatar avatar-lg">
                    <img src="/uploads/beers/${beerObj.beer._id}/${beerImage}">
                  </figure>
                </div>
                <div class="tile-content">
                  <p class="tile-title"><a href="/beers/${beerObj.beer._id}">${beerObj.beer.name}</a></p>
                  <p class="tile-subtitle">${review.body}</p>
                </div>
              </div>
      `
    })
  } catch (err) {
    console.log(err)
  }
}

getUserReviews()
