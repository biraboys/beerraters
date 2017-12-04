// async function getUserFollowing () {
//   const userId = document.getElementById('user-session-id').href.split('/')[4]
//   const activityList = document.getElementById('activity-list')
//   try {
//     const response = await fetch(`/users/${userId}/following`, {
//       method: 'get',
//       credentials: 'same-origin'
//     })
//     const user = await response.json()
//     console.log(user)
//     user.feed.forEach(feedItem => {
//       const feedListEl = document.createElement('li')
//       feedListEl.setAttribute('class', 'collection-item feed-item')
//       feedListEl.setAttribute('blah', feedItem._id)
//       feedListEl.innerHTML = feedItem.item
//       $(activityList).append(feedListEl)
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

async function getUsersOnline () {
  const followingList = document.getElementById('following-list')
  const userId = document.getElementById('user-session-id').href.split('/')[4]
  const followingAmount = document.getElementById('following-amount')
  const url = `/users/${userId}/following`
  try {
    const response = await fetch(url, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    followingAmount.innerHTML = user.following.length
    user.following.forEach(async following => {
      if (following.status === true) {
        followingList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
      } else {
        followingList.innerHTML +=
          `<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${following._id}">${following.username}</a></span>
          </li>`
      }
    })
  } catch (err) {
    console.log(err)
  }
}
async function getFeedItems () {
  const userId = document.getElementById('user-session-id').href.split('/')[4]
  const url = `/users/${userId}/following`
  try {
    const response = await fetch(url, {
      method: 'get',
      credentials: 'same-origin'
    })
    const user = await response.json()
    const followingIds = user.following.map(user => {
      return user._id
    })
    getFeed(followingIds)
  } catch (err) {
    console.log(err)
  }
}

async function getFeed (followingIds) {
  const activityList = document.getElementById('activity-list')  
  try {
    const feed = await fetch('/feed', {
      method: 'get',
      credentials: 'same-origin'
    })
    const json = await feed.json()
    json.forEach(feedItem => {
      if (followingIds.includes(feedItem.user_id)) {
        activityList.innerHTML += `
        <div class="col s12 m12 l5">
          <div class="card">
            <div class="card-content">
              <span class="card-title">
                <a href="/users/${feedItem.user_id}">${feedItem.username}</a>
                <i class="material-icons">account_circle</i>
              </span>
              <p>${feedItem.type} <a href="/beers/${feedItem.beer_id}">${feedItem.beer_name}</a></p>
              <div class="card-action">
                <span>
                  <i class="material-icons">schedule</i>
                  ${feedItem.created}
                </span>
              </div>
            </div>
          </div>
        </div>
        `
      }
    })
    console.log(json)
  } catch (err) {
    console.log(err)
  }
}

getUsersOnline()
getFeedItems()
// getUserFollowing()
