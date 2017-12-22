async function getUserConsumes (userId) {
  const userConsumeSpan = document.getElementById('consume-amount-span')
  if (userConsumeSpan) {
    try {
      const response = await fetch(`/users/${userId}/consumes`, {
        method: 'get',
        credentials: 'same-origin'
      })
      if (response.status === 200) {
        const userConsumedBeerArr = await response.json()
        displayUserConsumes(userConsumedBeerArr)
      }
    } catch (err) {
      Materialize.toast('Sorry, could not get user drinks', 2000)
    }
  }
}

async function getUserRatings (userId) {
  const isUserRatingLoaded = sessionStorage.getItem('isUserRatingLoaded')
  if (isUserRatingLoaded === null) {
    try {
      const response = await fetch(`/users/${userId}/ratings`, {
        method: 'get',
        credentials: 'same-origin'
      })
      if (response.status === 200) {
        const userRatingsArr = await response.json()
        displayUserRatings(userRatingsArr)
      }
    } catch (err) {
      Materialize.toast('Sorry, could not get user ratings', 2000)
    }
    sessionStorage.setItem('isUserRatingLoaded', 'true')
  }
}

async function getUserReviews (userId) {
  const isUserReviewsLoaded = sessionStorage.getItem('isUserReviewsLoaded')
  if (isUserReviewsLoaded === null) {
    try {
      const response = await fetch(`/users/${userId}/reviews`, {
        method: 'get',
        credentials: 'same-origin'
      })
      if (response.status === 200) {
        const userReviewsArr = await response.json()
        displayUserReviews(userReviewsArr)
      }
    } catch (err) {
      Materialize.toast('Sorry, could not get user reviews', 2000)
    }
    sessionStorage.setItem('isUserReviewsLoaded', 'true')
  }
}

async function getUserProfileImg (userId) {
  try {
    const response = await fetch(`/users/${userId}/profileImage`, {
      method: 'get',
      credentials: 'same-origin'
    })
    if (response.status === 200) {
      const userImage = await response.blob()
      createUserImage(userImage)
    }
  } catch (err) {
    console.log(err)
  }
}

async function toggleFollowUser (userId) {
  try {
    const response = await fetch(`/users/${userId}/follow`, {
      method: 'get',
      credentials: 'same-origin'
    })
    if (response.status === 200) {
      const followBtn = document.getElementById('follow-btn')
      const followersAmountSpan = document.getElementById('followers-amount-span')
      const followObj = await response.json()
      followBtn.innerText = followObj.status
      followersAmountSpan.innerText = followObj.amount
      sessionStorage.removeItem('isUserFollowersLoaded')
      getUserFollowers(userId)
    }
  } catch (err) {
    Materialize.toast('Sorry could not follow/unfollow user', 2000)
  }
}

async function getUserFollowers (userId) {
  const isUserFollowersLoaded = sessionStorage.getItem('isUserFollowersLoaded')
  if (isUserFollowersLoaded === null) {
    try {
      const response = await fetch(`/users/${userId}/followers`, {
        method: 'get',
        credentials: 'same-origin'
      })
      if (response.status === 200) {
        const userFollowersArr = await response.json()
        displayUserFollowers(userFollowersArr)
      }
    } catch (err) {
      Materialize.toast('Sorry, could not display followers for user', 2000)
    }
    sessionStorage.setItem('isUserFollowersLoaded', 'true')
  }
}

async function getUserFollowing (userId) {
  const isUserFollowingLoaded = sessionStorage.getItem('isUserFollowingLoaded')
  if (isUserFollowingLoaded === null) {
    try {
      const response = await fetch(`/users/${userId}/following`, {
        method: 'get',
        credentials: 'same-origin'
      })
      if (response.status === 200) {
        const userFollowingArr = await response.json()
        displayUserFollowing(userFollowingArr)
      }
    } catch (err) {
      Materialize.toast('Sorry, could not display following users', 2000)
    }
    sessionStorage.setItem('isUserFollowingLoaded', 'true')
  }
}

function displayUserFollowing (userFollowingArr) {
  const followIngList = document.getElementById('following-list')
  userFollowingArr.following.forEach(followingObj => {
    let followingStatusHtml
    followingObj.status === true ? followingStatusHtml = '<span class="user-status light-green accent-3 ml-10"></span>' : followingStatusHtml = '<span class="user-status grey lighten-2 ml-10"></span>'
    followIngList.innerHTML += `
    <span class="title following-span"><a class="beerraters-link" href="/users/${followingObj._id}">${followingObj.username} ${followingStatusHtml}</a>
    `
  })
}

function displayUserFollowers (userFollowersArr) {
  const followersList = document.getElementById('followers-list')
  followersList.innerHTML = '' 
  userFollowersArr.followers.forEach(followerObj => {
    let followerStatusHtml
    followerObj.status === true ? followerStatusHtml = '<span class="user-status light-green accent-3 ml-10"></span>' : followerStatusHtml = '<span class="user-status grey lighten-2 ml-10"></span>'
    followersList.innerHTML += `
    <span class="title follower-span"><a class="beerraters-link" href="/users/${followerObj._id}">${followerObj.username} ${followerStatusHtml}</a>
    `
  })
}

function setEventListeners (userId) {
  const followBtn = document.getElementById('follow-btn')
  const ratingAmountSpan = document.getElementById('rating-amount-span')
  const reviewAmountSpan = document.getElementById('review-amount-span')
  const imageAmountSpan = document.getElementById('image-amount-span')
  const followersAmountSpan = document.getElementById('followers-amount-span')
  const followingAmountSpan = document.getElementById('following-amount-span')
  if (followBtn) {
    followBtn.addEventListener('click', () => {
      toggleFollowUser(userId)
    })
  }
  if (ratingAmountSpan) {
    const ratingTab = document.getElementById('rating-tab')
    ratingTab.addEventListener('click', () => {
      getUserRatings(userId)
    })
  }
  if (reviewAmountSpan) {
    const reviewTab = document.getElementById('review-tab')
    reviewTab.addEventListener('click', () => {
      getUserReviews(userId)
    })
  }
  if (imageAmountSpan) {
    const imageTab = document.getElementById('image-tab')
    imageTab.addEventListener('click', () => {
      getUserImages(userId)
    })
  }
  if (followingAmountSpan.innerText !== '0') {
    const followingHeader = document.getElementById('following-header')
    followingHeader.addEventListener('click', () => {
      getUserFollowing(userId)
    })
  }
  if (followersAmountSpan.innerText !== '0') {
    const followersHeader = document.getElementById('followers-header')
    followersHeader.addEventListener('click', () => {
      getUserFollowers(userId)
    })
  }
}

function createUserImage (imageBlob) {
  const profileImageContainer = document.getElementById('profile-img-container')
  const profileImage = document.createElement('img')
  const objectURL = URL.createObjectURL(imageBlob)
  profileImage.src = objectURL
  profileImage.setAttribute('class', 'responsive-img card-image profile')
  profileImage.setAttribute('id', 'profile-img')
  profileImageContainer.appendChild(profileImage)
}

function createBeerImage (imageBlob) {
  const image = document.createElement('img')
  const objectURL = URL.createObjectURL(imageBlob)
  image.src = objectURL
  image.setAttribute('class', 'responsive-img')
  return image
}

function displayUserConsumes (consumedBeersArr) {
  const consumesList = document.getElementById('consume-list')
  consumedBeersArr.consumes.forEach(consumeObj => {
    consumesList.innerHTML += `
      <a href="/beers/${consumeObj.beer_id}" class="collection-item">${consumeObj.beer_name}</a>
      `
  })
}

function displayUserRatings (userRatingsArr) {
  const userRatingsList = document.getElementById('ratings-list')
  userRatingsArr.ratings.forEach(ratingObj => {
    userRatingsList.innerHTML += `
      <a href="/beers/${ratingObj.beer_id}" class="collection-item">${ratingObj.beer_name} <span class="card-subtitle">(${ratingObj.rating})</span></a>
      `
  })
}

function displayUserReviews (userReviewsArr) {
  const userReviewsContainer = document.getElementById('reviews-container')
  userReviewsArr.reviews.forEach(reviewsObj => {
    userReviewsContainer.innerHTML += `
    <li class="collection-item review-item">
    <span class="title">
      <a class="review-title beerraters-link" href="/beers/${reviewsObj.beer_id}">${reviewsObj.beer_name}</a>
    </span>
    <p>
    ${reviewsObj.place}
    </p>
    <p>
      <span class="card-subtitle review-body">${reviewsObj.body}</span>
    </p>
</li>
      `
  })
}

function displayUserImages (imageBlob, beerName) {
  const beerImage = createBeerImage(imageBlob)
  const imageContainer = document.getElementById('images-container')
  beerImage.setAttribute('class', 'materialboxed responsive-img caption-images')
  beerImage.setAttribute('data-caption', `${beerName}`)
  imageContainer.appendChild(beerImage)
  $('.materialboxed').materialbox()
}

async function getUserImages (userId) {
  const isUserReviewsLoaded = sessionStorage.getItem('isUserImagesLoaded')
  if (isUserReviewsLoaded === null) {
    const imagesAmount = parseInt(document.getElementById('image-amount-span').innerText)
    try {
      let i = 0
      while (i < imagesAmount) {
        const response = await fetch(`/users/${userId}/userImages`, {
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
          const beerImage = await response.blob()
          const beerName = response.headers.get('Beer-Name')
          displayUserImages(beerImage, beerName)
        }
        i++
      }
    } catch (err) {
      // console.log(err)
    }
    sessionStorage.setItem('isUserImagesLoaded', 'true')
  }
}

(async () => {
  sessionStorage.removeItem('isUserRatingLoaded')
  sessionStorage.removeItem('isUserReviewsLoaded')
  sessionStorage.removeItem('isUserImagesLoaded')
  sessionStorage.removeItem('isUserFollowersLoaded')
  sessionStorage.removeItem('isUserFollowingLoaded')
  const userId = location.href.split('/')[4]
  await Promise.all([
    getUserProfileImg(userId),
    getUserConsumes(userId)
  ])
  setEventListeners(userId)
})()
