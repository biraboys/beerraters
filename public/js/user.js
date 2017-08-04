const follow = document.getElementById('follow')
const followers = document.getElementById('followers')
const userIdElement = location.href
const userId = userIdElement.split('/')[4]
const ctx = document.getElementById('myChart').getContext('2d')

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
    window.location.href = '/login'
  } else if (response.status === 200) {
    if (follow.innerHTML[0] === 'F') {
      const value = parseInt(followers.innerHTML) + 1
      followers.innerHTML = value
      follow.innerHTML = 'Unfollow'
      location.href = `/users/${id}`
    } else {
      const value = parseInt(followers.innerHTML) - 1
      followers.innerHTML = value
      follow.innerHTML = 'Follow'
      location.href = `/users/${id}`
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
      let beerImage
      if (beerImageArr.length > 0) {
      const beerImageName = beerImageArr[0].name
      beerImage = `/uploads/beers/${beerObj.beer._id}/${beerImageName}`
      } else {
        beerImage = '/images/bottle.png'
      }
      reviewsContainer.innerHTML += `
       <li class="collection-item avatar">
         <img src="${beerImage}" alt="" class="circle">
            <span class="title"><a href="/beers/${beerObj.beer._id}">${beerObj.beer.name}</a></span>
            <p>
              ${review.place}
              <br>
              <span class="card-subtitle">${review.body}</span>
            </p>
            <a href="#!" class="secondary-content"><i class="material-icons">mode_edit</i></a>
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

async function getUser () {
  try {
    const response = await fetch(`/users/${userId}/json`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const userJson = await response.json()
    createChart(userJson.reviews.length, userJson.ratings.length, userJson.images.length, userJson.consumes.length)
    displayUserConsumes(userJson)
    displayUserRatings(userJson)
  } catch (err) {
    console.log(err)
  }
}
function createChart (reviews, rankings, images, consumes) {
  const myDoughnutChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Reviews', 'Rankings', 'Images', 'Consumes'],
    datasets: [{
      data: [reviews, rankings, images, consumes],
      backgroundColor: [
             'rgba(255, 99, 132, 0.2)',
             'rgba(54, 162, 235, 0.2)',
             'rgba(255, 206, 86, 0.2)',
             'rgba(75, 192, 192, 0.2)'
           ],
      borderColor: [
             'rgba(255,99,132,1)',
             'rgba(54, 162, 235, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(75, 192, 192, 1)'
           ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
      display: false
    }
  }
})
}

function displayUserConsumes (user) {
  const userConsumesList = document.getElementById('consume-list')
  if (user.consumes.length > 0) {
    user.consumes.forEach(beer => {
      userConsumesList.innerHTML += `
        <a href="/beers/${beer._id}" class="collection-item">${beer.name}</a>
      `
    })
  } else {
    userConsumesList.innerHTML += `
    <span class="card-title">No user consumes</span>
    `
  }
}

function displayUserRatings (user) {
  const userRatingsList = document.getElementById('ratings-list')
  if (user.ratings.length > 0) {
    user.ratings.forEach(beer => {
    let rating = 0
    beer.ratings.forEach(ratingObj => {
      if (ratingObj.user === userId) {
        rating = ratingObj.rating
      }
    })
      userRatingsList.innerHTML += `
        <a href="/beers/${beer._id}" class="collection-item">${beer.name} <span class="badge right">${rating}</span></a>
      `
    })
  } else {
    userRatingsList.innerHTML += `
    <span class="card-title">No user consumes</span>
    `
  }
}

getUserReviews()
getUserRanking()
getUser()
