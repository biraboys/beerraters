const userId = document.getElementById('user-session-id').href.split('/')[4]
const activityList = document.getElementById('activity-list')

async function getUserFollowing () {
  try {
    const response = await fetch(`/users/${userId}/following`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    user.following.forEach(following =>{
      activityList.innerHTML += `
      <li class="collection-item">${following.username} amount of images: ${following.images.length}</li>
      <li class="collection-item">${following.username} amount of ratings: ${following.ratings.length}</li>
      <li class="collection-item">${following.username} amount of reviews: ${following.reviews.length}</li>
      <li class="collection-item">${following.username} amount of consumes: ${following.consumes.length}</li>                  
      `
    })
    console.log(user)
  } catch (err) {
    console.log(err)
  }
}

async function getUserContributions () {
  try {
    const response = await fetch(`/users/${userId}/following`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    user.following.forEach(following =>{
      activityList.innerHTML += `
      <li class="collection-item">${following.username} amount of images: ${following.images.length}</li>
      <li class="collection-item">${following.username} amount of ratings: ${following.ratings.length}</li>
      <li class="collection-item">${following.username} amount of reviews: ${following.reviews.length}</li>
      <li class="collection-item">${following.username} amount of consumes: ${following.consumes.length}</li>                  
      `
    })
    console.log(user)
  } catch (err) {
    console.log(err)
  }
}

getUserFollowing()

async function getUsersOnline() {
  console.log(userId)
  try {
    const response = await fetch(location.pathname, {
      method: 'get',
      credentials: 'same-origin'
    })
  } catch (err) {
    console.log(err)
  }
}

getUsersOnline()
