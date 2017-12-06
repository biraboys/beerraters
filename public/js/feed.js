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
    const feedCounterSpan = document.getElementById('feed-counter-span')
    if (localStorage.getItem('newFeedCounter') !== null) {
      let feedCounter = Number(localStorage.getItem('newFeedCounter'))
      feedCounter++
      localStorage.setItem('newFeedCounter', feedCounter)
    } else {
      localStorage.setItem('newFeedCounter', 1)
    }
    feedCounterSpan.innerText = localStorage.getItem('newFeedCounter')
    const newFeedItem = `
    <div class="col s12 m12 l4">
      <div class="card pulse">
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
    activityList.insertAdjacentHTML('afterbegin', newFeedItem)
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
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    json.forEach(feedItem => {
      const date = new Date(feedItem.created)
      feedItem.created = date.toLocaleDateString('en-GB', dateOptions)
      if (followingIds.includes(feedItem.user_id)) {
        activityList.innerHTML += `
        <div class="col s12 m12 l4">
          <div class="card feed-item">
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
      getNewFeedCounter()
    })
  } catch (err) {
    console.log(err)
  }
}

/**
 * Checks localStorage to see the amount of new feed items for the user.
 */
function getNewFeedCounter () {
  const feedCounterSpan = document.getElementById('feed-counter-span')
  const feedItems = document.getElementsByClassName('feed-item')
  const newFeedCounter = localStorage.getItem('newFeedCounter')
  if (newFeedCounter !== null) {
    let feedItemIndex = 0
    for (const feedItem of feedItems) {
      if (feedItemIndex < Number(newFeedCounter)) {
        feedItem.classList.add('pulse')
      }
      feedItemIndex++
    }
    feedCounterSpan.innerText = newFeedCounter
  } else {
    feedCounterSpan.innerText = 0
  }
}

getUsersOnline()
getFeedItems()
