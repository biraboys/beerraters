const follow = document.getElementById('follow')
const followers = document.getElementById('followers')
const userIdElement = location.href
const userId = userIdElement.split('/')[4]
const ctx = document.getElementById('myChart').getContext('2d')
const modalTriggers = Array.from(document.getElementsByClassName('modal-trigger'))
const editReviewForm = document.forms.editReviewForm
const editModalTitle = document.getElementById('edit-modal-title')
const imageContainer = document.getElementById('profile-img')

if (imageContainer.childNodes.length === 1) { getUserProfileImg() }

if (follow) {
  follow.addEventListener('click', function (e) {
    e.preventDefault()
    followUser()
  })
}

if (modalTriggers.length > 0) {
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const title = this.parentNode.childNodes[3].innerHTML
      const body = this.parentNode.childNodes[7].innerText
      editModalTitle.innerHTML = title
      editReviewForm.body.value = body
      $('#body').trigger('autoresize')
    })
  })
}

editReviewForm.addEventListener('submit', function (e) {
  e.preventDefault()
  const body = this.body.value
  const title = document.getElementById('edit-modal-title')
  const reviewId = title.childNodes[1].getAttribute('data-target')
  editReview(reviewId, body)
})

async function editReview (reviewId, text) {
  try {
    const response = await fetch(`/reviews/${reviewId}`, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify({
        review: text
      })
    })
    if (response.status === 200) {
      Materialize.toast(`Review sucessfully updated! Reloading...`, 2000)
      setTimeout(() => {
        location.reload(true)
      }, 2000)
    }
  } catch (err) {
    console.log(err)
  }
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

async function getUserProfileImg () {
  try {
    const response = await fetch(`/users/${userId}/get-profileimage`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const img = await response.blob()
    const image = document.createElement('img')
    const objectURL = URL.createObjectURL(img)
    image.src = objectURL
    image.setAttribute('class', 'responsive-img card-image profile')
    imageContainer.appendChild(image)
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
    <span class="card-title">No user ratings</span>
    `
  }
}

// getUserRanking()
// getUser()
// getUserProfileImg()
