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
       <li class="collection-item avatar">
         <img src="/uploads/beers/${beerObj.beer._id}/${beerImage}" alt="" class="circle">
            <span class="title"><a href="/beers/${beerObj.beer._id}">${beerObj.beer.name}</a></span>
            <p>
              ${review.place}
              <br>
              <span class="card-subtitle">${review.body}</span>
            </p>
            <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
       </li>
      `
    })
  } catch (err) {
    console.log(err)
  }
}

async function getUserRanking () {
  const rankingField = document.getElementById('ranking-field')
  try {
    const response = await fetch('/users')
    const users = await response.json()
    users.forEach(user => {
      user.contributions = user.reviews.length + user.ratings.length + user.consumes.length + user.images.length
    })
    users.sort((a, b) => {
      return a.contributions > b.contributions ? -1 : a.contributions < b.contributions ? 1 : 0
    })
    const newUserArr = users.map(user => {
      return user._id
    })
    const ranking = (newUserArr.indexOf(userId) + 1)
    rankingField.innerHTML = ranking
  } catch (err) {
    console.log(err)
  }
}

getUserReviews()
getUserRanking()

// Accordians
$(document).ready(function () {
  $('.collapsible').collapsible()
})

//     const users = await User.find({}, 'country_id reviews ratings images consumes ')
//     users.filter(userObj => {
//       if (userObj.country_id === user.country_id) {
//         return userObj
//       }
//     })
//     users.sort((a, b) => {
//       return ((a.reviews.length + a.ratings.length + a.consumes.length + a.images.length) < (b.reviews.length + b.ratings.length + b.consumes.length + b.images.length)) ? -1 : ((a.reviews.length + a.ratings.length + a.consumes.length + a.images.length) > (b.reviews.length + b.ratings.length + b.consumes.length + b.images.length)) ? 1 : 0
//     })
//     const position = users.findIndex(userObj => {
//       return userObj._id === user._id
//     })
//     console.log(position)


