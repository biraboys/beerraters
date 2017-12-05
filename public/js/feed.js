const socket = io.connect('/', {transports: ['websocket']})
socket.on('news', async function (feedItem) {
  const userId = document.getElementById('user-session-id').href.split('/')[4]
  const response = await fetch(`/users/${userId}/following`, {
    method: 'get',
    credentials: 'same-origin'
  })
  const users = await response.json()
  const userIds = users.following.map(user => {
    return user._id
  })
  if (userIds.includes(feedItem.user_id)) {
    const activityList = document.getElementById('activity-list')
    const newFeedCounter = document.getElementById('new-feed-counter')
    let counter = Number(newFeedCounter.innerText)
    counter++
    newFeedCounter.innerText = counter
    activityList.innerHTML += `
      <div class="col s12 m12 l4">
        <div class="card" style="border:solid #BF923B;">
          <div class="card-content">
            <span class="card-title">
              <i class="material-icons">account_circle</i>
              <a href="/users/${feedItem.user_id}">${feedItem.username}</a>
            </span>
            <p>${feedItem.type} <a href="/beers/${feedItem.beer_id}">${feedItem.beer_name}</a></p>
            </div>
            <div class="card-action">
              <span>
                <i class="material-icons">schedule</i>
                ${feedItem.created}
              </span>
            </div>
          </div>
      </div>
      `
  }
})

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
    json.sort((a, b) => {
      return new Date(b.created) - new Date(a.created)
    })
    json.forEach(feedItem => {
      feedItem.created = new Date(feedItem.created.toLocaleString())
      if (followingIds.includes(feedItem.user_id)) {
        activityList.innerHTML += `
        <div class="col s12 m12 l4">
          <div class="card">
            <div class="card-content">
              <span class="card-title">
                <i class="material-icons va-middle fs-32">account_circle</i>
                <a href="/users/${feedItem.user_id}" class="va-middle">${feedItem.username}</a>
              </span>
              <p>${feedItem.type} <a href="/beers/${feedItem.beer_id}">${feedItem.beer_name}</a></p>
              </div>
              <div class="card-action">
                <span>
                  <i class="material-icons va-middle fs-32">schedule</i>
                  <span class="class="va-middle">${feedItem.created}</span>
                </span>
              </div>
            </div>
        </div>
        `
      }
    })
  } catch (err) {
    console.log(err)
  }
}

getUsersOnline()
getFeedItems()
