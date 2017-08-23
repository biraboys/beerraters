const userId = document.getElementById('user-session-id').href.split('/')[4]
const activityList = document.getElementById('activity-list')
const onlineList = document.getElementById('online')
const offlineList = document.getElementById('offline')
const offlineFollowers = document.getElementById('offline-followers')
const onlineFollowers = document.getElementById('online-followers')

if (localStorage.getItem('activity') !== null) {
  const activity = localStorage.getItem('activity')
  activityList.innerHTML = activity
}
async function getUserFollowing () {
  try {
    const response = await fetch(`/users/${userId}/following`, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    await user.feed.forEach(feedItem => {
      const feedListEl = document.createElement('li')
      feedListEl.setAttribute('class', 'collection-item')
      feedListEl.innerHTML = feedItem.item
      $(activityList).append(feedListEl)
    })
    console.log(user)
  } catch (err) {
    console.log(err)
  }
}

// async function getUserContributions () {
//   try {
//     const response = await fetch(`/users/${userId}/following`, {
//       method: 'get',
//       credentials: 'same-origin'
//     })
//     const user = await response.json()
//     user.following.forEach(following =>{
//       activityList.innerHTML += `
//       <li class="collection-item">${following.username} amount of images: ${following.images.length}</li>
//       <li class="collection-item">${following.username} amount of ratings: ${following.ratings.length}</li>
//       <li class="collection-item">${following.username} amount of reviews: ${following.reviews.length}</li>
//       <li class="collection-item">${following.username} amount of consumes: ${following.consumes.length}</li>
//       `
//     })
//     console.log(user)
//   } catch (err) {
//     console.log(err)
//   }
// }

// getUserFollowing()

async function getUsersOnline () {
  const url = `/users/${userId}/following`
  try {
    const response = await fetch(url, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    let usersOnline = 0
    let usersOffline = 0

    user.following.forEach(following => {
      if (following.status === true) {
        usersOnline += 1
        if (following.profileImg.length > 0) {
          onlineList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/uploads/users/${following._id}/${following.profileImg}" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
        } else {
          onlineList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
        }
      } else {
        usersOffline += 1
        if (following.profileImg.length > 0) {
          offlineList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/uploads/users/${following._id}/${following.profileImg}" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
        } else {
          offlineList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
        }
      }
    })
    onlineFollowers.innerHTML = usersOnline
    offlineFollowers.innerHTML = usersOffline
  } catch (err) {
    console.log(err)
  }
}

getUsersOnline()
getUserFollowing()
